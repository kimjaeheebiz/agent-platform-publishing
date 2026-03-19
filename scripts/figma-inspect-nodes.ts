#!/usr/bin/env node
/**
 * Figma REST API로 노드 스냅샷 출력 (extractor 디버깅용)
 *
 * 사용 예:
 *   npm run figma:inspect-nodes
 *   npm run figma:inspect-nodes -- --library 16541:41847 6570:40824
 *   # PowerShell: 세미콜론(;)은 명령 구분자이므로 반드시 따옴표로 감싸거나 쉼표 경로 사용
 *   npm run figma:inspect-nodes -- --platform "I85:7808;282:67901;16541:41847"
 *   npm run figma:inspect-nodes -- --platform 85:7808,282:67901,16541:41847
 *
 * 경로는 세미콜론(;) 또는 쉼표(,)로 나눠 각 ID를 순서대로 조회합니다. (쉼표는 PowerShell에서 안전)
 *
 * .env: FIGMA_TOKEN, FIGMA_FILE_PLATFORM, FIGMA_FILE_LIBRARY
 */
import 'dotenv/config';
import { validateFigmaEnvironment } from '../src/api/figma/config.js';
import { FigmaAPIClient } from '../src/api/figma/client.js';

type AnyNode = Record<string, unknown>;

function summarizeNode(n: AnyNode, depth: number, maxDepth: number): unknown {
    if (!n || typeof n !== 'object') return n;
    const type = n.type;
    const name = n.name;
    const id = n.id;
    const base: Record<string, unknown> = { id, type, name };
    if (type === 'TEXT') {
        base.characters = n.characters;
        base.visible = n.visible;
    }
    if (type === 'INSTANCE') {
        base.componentId = n.componentId;
        const cp = n.componentProperties as Record<string, unknown> | undefined;
        if (cp && typeof cp === 'object') {
            const keys = Object.keys(cp);
            base.componentPropertyKeys = keys;
            const sample: Record<string, unknown> = {};
            for (const k of keys.slice(0, 30)) {
                const v = cp[k] as { type?: string; value?: unknown } | undefined;
                sample[k] = v && typeof v === 'object' ? { type: v.type, value: v.value } : v;
            }
            base.componentPropertiesSample = sample;
            if (keys.length > 30) base._moreProps = keys.length - 30;
        }
    }
    if (depth < maxDepth && Array.isArray(n.children)) {
        base.childrenCount = n.children.length;
        base.childrenPreview = (n.children as AnyNode[]).slice(0, 15).map((c) => ({
            id: c.id,
            type: c.type,
            name: c.name,
            characters: c.type === 'TEXT' ? c.characters : undefined,
        }));
        if ((n.children as AnyNode[]).length > 15) {
            base._moreChildren = (n.children as AnyNode[]).length - 15;
        }
    }
    return base;
}

function findLabelText(node: AnyNode, path: string): void {
    const nm = String(node.name ?? '').trim();
    if (node.type === 'TEXT' && node.characters && nm.toLowerCase() === 'label') {
        console.log(`   [TEXT Label] path=${path} characters=${JSON.stringify(node.characters)}`);
    }
    if (Array.isArray(node.children)) {
        for (const ch of node.children as AnyNode[]) {
            findLabelText(ch, `${path}/${String(ch.name ?? '?')}`);
        }
    }
}

function normalizeIds(raw: string[]): string[] {
    const out: string[] = [];
    for (const r of raw) {
        const s = r.replace(/^I/i, '').trim();
        const sep = s.includes(';') ? ';' : s.includes(',') ? ',' : null;
        if (sep) {
            for (const part of s.split(sep).map((p) => p.trim()).filter(Boolean)) {
                out.push(part.replace(/^I/i, ''));
            }
        } else {
            out.push(s);
        }
    }
    return out;
}

async function inspectOne(
    client: FigmaAPIClient,
    fileKey: string,
    label: string,
    nodeId: string,
): Promise<void> {
    try {
        const res = await client.getFileNodes(fileKey, [nodeId]);
        const entry = res.nodes[nodeId] as unknown as { document: AnyNode } | undefined;
        if (!entry?.document) {
            console.log(`❌ [${label}] ${nodeId} → 응답 없음`);
            return;
        }
        const doc = entry.document;
        console.log(`\n========== [${label}] ${nodeId} ==========`);
        console.log(JSON.stringify(summarizeNode(doc, 0, 4), null, 2));
        console.log('--- name=Label 인 TEXT 전체 검색 ---');
        findLabelText(doc, String(doc.name ?? 'root'));
    } catch (e) {
        console.log(`❌ [${label}] ${nodeId} → ${(e as Error).message}`);
    }
}

async function main() {
    const argv = process.argv.slice(2);
    let useLibrary = false;
    let usePlatform = false;
    const ids: string[] = [];
    for (const a of argv) {
        if (a === '--library' || a === '-l') useLibrary = true;
        else if (a === '--platform' || a === '-p') usePlatform = true;
        else if (!a.startsWith('-')) ids.push(a);
    }

    const env = validateFigmaEnvironment();
    const platformKey = env.FIGMA_FILE_PLATFORM;
    const libraryKey = env.FIGMA_FILE_LIBRARY;

    const nodeIds = normalizeIds(
        ids.length > 0
            ? ids
            : ['85:7808', '282:67901', '16541:41847', '6570:40824'],
    );

    const files: { label: string; key: string }[] = [];
    if (useLibrary && !usePlatform) {
        files.push({ label: 'LIBRARY', key: libraryKey });
    } else if (usePlatform && !useLibrary) {
        files.push({ label: 'PLATFORM', key: platformKey });
    } else {
        files.push({ label: 'PLATFORM', key: platformKey });
        files.push({ label: 'LIBRARY', key: libraryKey });
    }

    console.log('📌 figma:inspect-nodes');
    console.log('   조회할 nodeIds:', nodeIds.join(' | '));
    console.log('');

    const client = new FigmaAPIClient(env.FIGMA_TOKEN);

    for (const { label, key } of files) {
        console.log(`\n#################### 파일: ${label} (${key}) ####################`);
        for (const nodeId of nodeIds) {
            await inspectOne(client, key, label, nodeId);
        }
    }

    console.log(
        '\n💡 Dev Mode 링크의 node-id=85-7808-282-67901 형태는 API에선 85:7808, 282:67901 처럼 콜론으로 바꿔 넣으면 됩니다.',
    );
    console.log(
        '💡 플랫폼에서만 실제 인스턴스가 있으면 PLATFORM에만 ID가 있고, 컴포넌트 정의는 LIBRARY에만 있을 수 있습니다.',
    );
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

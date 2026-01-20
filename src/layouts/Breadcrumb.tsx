/**
 * Breadcrumb 컴포넌트 (Mantis 스타일)
 *
 * 메뉴 구조를 기반으로 Breadcrumb를 생성합니다.
 */

import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { getBreadcrumbPath } from '@/config';
import { useMemo } from 'react';

export const Breadcrumb = () => {
    const location = useLocation();

    const generateBreadcrumbs = () => {
        // 홈인 경우 breadcrumb 미노출
        if (location.pathname === '/') {
            return [];
        }

        const list: Array<{ label: string; path?: string; isLast: boolean; isClickable: boolean }> = [
            {
                label: '홈',
                path: '/',
                isLast: false,
                isClickable: true,
            },
        ];

        const breadcrumbPath = getBreadcrumbPath(location.pathname);

        breadcrumbPath.forEach((item, index) => {
            const isLast = index === breadcrumbPath.length - 1;
            const isClickable = !!item.path && !isLast;

            list.push({
                label: item.title,
                path: item.path,
                isLast,
                isClickable,
            });
        });

        return list;
    };

    const breadcrumbs = useMemo(generateBreadcrumbs, [location.pathname]);

    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: '0.875rem' }}>
            {breadcrumbs.map((bc, index) =>
                bc.isLast ? (
                    <Typography key={index} variant="body2" sx={{ color: 'text.primary' }} aria-current="page">
                        {bc.label}
                    </Typography>
                ) : bc.isClickable && bc.path ? (
                    <Link key={index} component={RouterLink} to={bc.path} underline="hover" color="inherit">
                        {bc.label}
                    </Link>
                ) : (
                    <Typography key={index} variant="body2" sx={{ color: 'text.secondary' }}>
                        {bc.label}
                    </Typography>
                ),
            )}
        </Breadcrumbs>
    );
};

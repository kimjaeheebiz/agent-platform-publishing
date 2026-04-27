/**
 * 병합 MUI 테마 옵션 — 자동 생성 (수정 금지)
 *
 * 생성: npm run build:theme
 *  - 1) design-system 토큰 → theme.light.json / theme.dark.json
 *  - 2) 본 파일 ← 토큰 산출 테마 + 컴포넌트 오버라이드(muiComponents.ts) 병합
 *
 * 편집 위치:
 *  - 색·타이포·토큰: design-system/tokens → build:theme
 *  - 컴포넌트 커스텀: src/theme/appTheme/muiComponents.ts → build:theme
 *
 * 운영/타 프로젝트: 이 파일만 복사 후 createLightTheme / createDarkTheme 사용.
 * @see https://mui.com/material-ui/customization/theming/
 */

import { createTheme, type Theme, type ThemeOptions } from '@mui/material/styles';

export const lightThemeOptions: ThemeOptions = {
  "_library": {
    "clickableLayer": {
      "$type": "color",
      "$value": "#00000000"
    },
    "colorHighlight": {
      "$type": "color",
      "$value": "#9747ff"
    },
    "fillHighlight": {
      "$type": "color",
      "$value": "#9747ff0a"
    },
    "heading": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.36}",
        "fontSize": "{fontSize.10}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "elevation": {
    "1": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 1,
          "blur": 3,
          "spread": 0
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 1,
          "blur": 1,
          "spread": 0
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 2,
          "blur": 1,
          "spread": -1
        }
      ]
    },
    "2": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 1,
          "blur": 5,
          "spread": 0
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 2,
          "blur": 2,
          "spread": 0
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 3,
          "blur": 1,
          "spread": -2
        }
      ]
    },
    "3": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 1,
          "blur": 8,
          "spread": 0
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 3,
          "blur": 4,
          "spread": 0
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 3,
          "blur": 3,
          "spread": -2
        }
      ]
    },
    "4": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 1,
          "blur": 10,
          "spread": 0
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 4,
          "blur": 5,
          "spread": 0
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 2,
          "blur": 4,
          "spread": -1
        }
      ]
    },
    "5": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 1,
          "blur": 14,
          "spread": 0
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 5,
          "blur": 8,
          "spread": 0
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 3,
          "blur": 5,
          "spread": -1
        }
      ]
    },
    "6": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 1,
          "blur": 18,
          "spread": 0
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 6,
          "blur": 10,
          "spread": 0
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 3,
          "blur": 5,
          "spread": -1
        }
      ]
    },
    "7": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 2,
          "blur": 16,
          "spread": 1
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 7,
          "blur": 10,
          "spread": 1
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 4,
          "blur": 5,
          "spread": -2
        }
      ]
    },
    "8": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 3,
          "blur": 14,
          "spread": 2
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 8,
          "blur": 10,
          "spread": 1
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 5,
          "blur": 5,
          "spread": -3
        }
      ]
    },
    "9": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 3,
          "blur": 16,
          "spread": 2
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 9,
          "blur": 12,
          "spread": 1
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 5,
          "blur": 6,
          "spread": -3
        }
      ]
    },
    "10": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 4,
          "blur": 18,
          "spread": 3
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 10,
          "blur": 14,
          "spread": 1
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 6,
          "blur": 6,
          "spread": -3
        }
      ]
    },
    "11": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 4,
          "blur": 20,
          "spread": 3
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 11,
          "blur": 15,
          "spread": 1
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 6,
          "blur": 7,
          "spread": -4
        }
      ]
    },
    "12": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 5,
          "blur": 22,
          "spread": 4
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 12,
          "blur": 17,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 7,
          "blur": 8,
          "spread": -4
        }
      ]
    },
    "13": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 5,
          "blur": 24,
          "spread": 4
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 13,
          "blur": 19,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 7,
          "blur": 8,
          "spread": -4
        }
      ]
    },
    "14": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 5,
          "blur": 26,
          "spread": 4
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 14,
          "blur": 21,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 7,
          "blur": 9,
          "spread": -4
        }
      ]
    },
    "15": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 6,
          "blur": 28,
          "spread": 5
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 15,
          "blur": 22,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 8,
          "blur": 9,
          "spread": -5
        }
      ]
    },
    "16": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 6,
          "blur": 30,
          "spread": 5
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 16,
          "blur": 24,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 8,
          "blur": 10,
          "spread": -5
        }
      ]
    },
    "17": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 6,
          "blur": 32,
          "spread": 5
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 17,
          "blur": 26,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 8,
          "blur": 11,
          "spread": -5
        }
      ]
    },
    "18": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 7,
          "blur": 34,
          "spread": 6
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 18,
          "blur": 28,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 9,
          "blur": 11,
          "spread": -5
        }
      ]
    },
    "19": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 7,
          "blur": 36,
          "spread": 6
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 19,
          "blur": 29,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 9,
          "blur": 12,
          "spread": -6
        }
      ]
    },
    "20": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 8,
          "blur": 38,
          "spread": 7
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 20,
          "blur": 31,
          "spread": 3
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 10,
          "blur": 13,
          "spread": -6
        }
      ]
    },
    "21": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 8,
          "blur": 40,
          "spread": 7
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 21,
          "blur": 33,
          "spread": 3
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 10,
          "blur": 13,
          "spread": -6
        }
      ]
    },
    "22": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 8,
          "blur": 42,
          "spread": 7
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 22,
          "blur": 35,
          "spread": 3
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 10,
          "blur": 14,
          "spread": -6
        }
      ]
    },
    "23": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 9,
          "blur": 44,
          "spread": 8
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 23,
          "blur": 36,
          "spread": 3
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 11,
          "blur": 14,
          "spread": -7
        }
      ]
    },
    "24": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 9,
          "blur": 46,
          "spread": 8
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 24,
          "blur": 38,
          "spread": 3
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 11,
          "blur": 15,
          "spread": -7
        }
      ]
    }
  },
  "fontFamilies": {
    "roboto": {
      "$type": "fontFamilies",
      "$value": "Roboto"
    }
  },
  "lineHeights": {
    "0": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "1": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "2": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "3": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "4": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "5": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "6": {
      "$type": "lineHeights",
      "$value": "150%"
    },
    "7": {
      "$type": "lineHeights",
      "$value": "150%"
    },
    "8": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "9": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "10": {
      "$type": "lineHeights",
      "$value": "266%"
    },
    "11": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "12": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "13": {
      "$type": "lineHeights",
      "$value": "150%"
    },
    "14": {
      "$type": "lineHeights",
      "$value": "143%"
    },
    "15": {
      "$type": "lineHeights",
      "$value": "100%"
    },
    "16": {
      "$type": "lineHeights",
      "$value": "100%"
    },
    "17": {
      "$type": "lineHeights",
      "$value": "100%"
    },
    "18": {
      "$type": "lineHeights",
      "$value": 20
    },
    "19": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "20": {
      "$type": "lineHeights",
      "$value": 26
    },
    "21": {
      "$type": "lineHeights",
      "$value": 24
    },
    "22": {
      "$type": "lineHeights",
      "$value": 20
    },
    "23": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "24": {
      "$type": "lineHeights",
      "$value": "150%"
    },
    "25": {
      "$type": "lineHeights",
      "$value": 12
    },
    "26": {
      "$type": "lineHeights",
      "$value": 24
    },
    "27": {
      "$type": "lineHeights",
      "$value": 24
    },
    "28": {
      "$type": "lineHeights",
      "$value": "130%"
    },
    "29": {
      "$type": "lineHeights",
      "$value": 36
    },
    "30": {
      "$type": "lineHeights",
      "$value": "150%"
    },
    "31": {
      "$type": "lineHeights",
      "$value": "150%"
    },
    "32": {
      "$type": "lineHeights",
      "$value": 20
    },
    "33": {
      "$type": "lineHeights",
      "$value": 24
    },
    "34": {
      "$type": "lineHeights",
      "$value": 14
    },
    "35": {
      "$type": "lineHeights",
      "$value": 12
    },
    "36": {
      "$type": "lineHeights",
      "$value": "116.7%"
    },
    "37": {
      "$type": "lineHeights",
      "$value": "166%"
    },
    "38": {
      "$type": "lineHeights",
      "$value": "166%"
    }
  },
  "fontWeights": {
    "pretendard-variable-0": {
      "$type": "fontWeights",
      "$value": "SemiBold"
    },
    "pretendard-variable-1": {
      "$type": "fontWeights",
      "$value": "Regular"
    },
    "pretendard-variable-2": {
      "$type": "fontWeights",
      "$value": "Medium"
    },
    "roboto-3": {
      "$type": "fontWeights",
      "$value": "Regular"
    }
  },
  "fontSize": {
    "0": {
      "$type": "fontSizes",
      "$value": 10
    },
    "1": {
      "$type": "fontSizes",
      "$value": 12
    },
    "2": {
      "$type": "fontSizes",
      "$value": 13
    },
    "3": {
      "$type": "fontSizes",
      "$value": 14
    },
    "4": {
      "$type": "fontSizes",
      "$value": 15
    },
    "5": {
      "$type": "fontSizes",
      "$value": 16
    },
    "6": {
      "$type": "fontSizes",
      "$value": 20
    },
    "7": {
      "$type": "fontSizes",
      "$value": 24
    },
    "8": {
      "$type": "fontSizes",
      "$value": 34
    },
    "9": {
      "$type": "fontSizes",
      "$value": 60
    },
    "10": {
      "$type": "fontSizes",
      "$value": 64
    },
    "33": {
      "$type": "fontSizes",
      "$value": "64"
    },
    "34": {
      "$type": "fontSizes",
      "$value": "12"
    }
  },
  "letterSpacing": {
    "0": {
      "$type": "letterSpacing",
      "$value": 0
    },
    "1": {
      "$type": "letterSpacing",
      "$value": 0.15
    },
    "2": {
      "$type": "letterSpacing",
      "$value": "0%"
    },
    "3": {
      "$type": "letterSpacing",
      "$value": "0%"
    },
    "4": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "5": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "6": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "7": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "8": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "9": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "10": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "11": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "12": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "13": {
      "$type": "letterSpacing",
      "$value": "0.15"
    },
    "14": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "15": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "16": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "17": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "18": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "19": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "20": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "21": {
      "$type": "letterSpacing",
      "$value": "0.46"
    },
    "22": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "23": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "24": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "25": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "26": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "27": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "28": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "29": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "30": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "31": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "32": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "33": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "34": {
      "$type": "letterSpacing",
      "$value": "0"
    }
  },
  "paragraphSpacing": {
    "0": {
      "$type": "paragraphSpacing",
      "$value": 0
    },
    "1": {
      "$type": "paragraphSpacing",
      "$value": 12
    },
    "2": {
      "$type": "paragraphSpacing",
      "$value": 20
    },
    "3": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "4": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "5": {
      "$type": "paragraphSpacing",
      "$value": "20"
    },
    "6": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "7": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "8": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "9": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "10": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "11": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "12": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "13": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "14": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "15": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "16": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "17": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "18": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "19": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "20": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "21": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "22": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "23": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "24": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "25": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "26": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "27": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "28": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "29": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "30": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "31": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "32": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "33": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "34": {
      "$type": "paragraphSpacing",
      "$value": "12"
    }
  },
  "typography": {
    "fontFamily": "Pretendard Variable, '맑은 고딕', -apple-system, 'Roboto', 'Arial', sans-serif",
    "h1": {
      "fontSize": "3.75rem",
      "fontWeight": 600,
      "lineHeight": 1.2
    },
    "h2": {
      "fontSize": "2.125rem",
      "fontWeight": 600,
      "lineHeight": 1.2
    },
    "h3": {
      "fontSize": "1.5rem",
      "fontWeight": 600,
      "lineHeight": 1.2
    },
    "h4": {
      "fontSize": "1.25rem",
      "fontWeight": 600,
      "lineHeight": 1.2
    },
    "h5": {
      "fontSize": "1rem",
      "fontWeight": 600,
      "lineHeight": 1.2
    },
    "h6": {
      "fontSize": "0.875rem",
      "fontWeight": 600,
      "lineHeight": 1.2
    },
    "body1": {
      "fontSize": "0.875rem",
      "fontWeight": 400,
      "lineHeight": 1.5
    },
    "body2": {
      "fontSize": "0.8125rem",
      "fontWeight": 400,
      "lineHeight": 1.5
    },
    "subtitle1": {
      "fontSize": "1rem",
      "fontWeight": 500,
      "lineHeight": 1.2
    },
    "subtitle2": {
      "fontSize": "0.875rem",
      "fontWeight": 500,
      "lineHeight": 1.2
    },
    "caption": {
      "fontSize": "0.75rem",
      "fontWeight": 400,
      "lineHeight": 1.2
    },
    "overline": {
      "fontSize": "0.75rem",
      "fontWeight": 400,
      "lineHeight": 2.66,
      "textTransform": "uppercase"
    }
  },
  "alert": {
    "title": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.6}",
        "fontSize": "{fontSize.5}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "description": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.14}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.1}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "avatar": {
    "initialsLg": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.15}",
        "fontSize": "{fontSize.6}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "initialsSm": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.15}",
        "fontSize": "{fontSize.0}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "initialsMd": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.15}",
        "fontSize": "{fontSize.1}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "badge": {
    "label": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.18}",
        "fontSize": "{fontSize.1}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "bottomNavigation": {
    "activeLabel": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.0}",
        "fontSize": "{fontSize.3}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "button": {
    "large": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.20}",
        "fontSize": "{fontSize.4}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.uppercase}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "medium": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.21}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.uppercase}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "small": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.18}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.uppercase}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "chip": {
    "label": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.0}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "datePicker": {
    "currentMonth": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.6}",
        "fontSize": "{fontSize.5}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "input": {
    "label": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.25}",
        "fontSize": "{fontSize.1}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "value": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.21}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "helper": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.28}",
        "fontSize": "{fontSize.1}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "valueLarge": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.21}",
        "fontSize": "{fontSize.4}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "list": {
    "subheader": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.29}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "menu": {
    "itemDefault": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.6}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "itemDense": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.6}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "itemSmall": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.18}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.2}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "table": {
    "header": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.21}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "tooltip": {
    "label": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.34}",
        "fontSize": "{fontSize.0}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "dataGrid": {
    "aggregationColumnHeaderLabel": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.25}",
        "fontSize": "{fontSize.1}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.uppercase}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "charts": {
    "group": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamilies.roboto}",
        "fontWeight": "{fontWeights.roboto-3}",
        "lineHeight": "{lineHeights.37}",
        "fontSize": "{fontSize.1}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.1}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "textCase": {
    "none": {
      "$type": "textCase",
      "$value": "none"
    },
    "uppercase": {
      "$type": "textCase",
      "$value": "uppercase"
    }
  },
  "textDecoration": {
    "none": {
      "$type": "textDecoration",
      "$value": "none"
    }
  },
  "paragraphIndent": {
    "0": {
      "$type": "dimension",
      "$value": "0px"
    }
  },
  "spacing": 8,
  "breakpoints": {
    "values": {
      "xs": 444,
      "sm": 600,
      "md": 900,
      "lg": 1200,
      "xl": 1536
    }
  },
  "shape": {
    "borderRadius": 4
  },
  "shadows": [
    "none",
    "0px 1px 3px 0px #0000001f, 0px 1px 1px 0px #00000024, 0px 2px 1px -1px #00000033",
    "0px 1px 5px 0px #0000001f, 0px 2px 2px 0px #00000024, 0px 3px 1px -2px #00000033",
    "0px 1px 8px 0px #0000001f, 0px 3px 4px 0px #00000024, 0px 3px 3px -2px #00000033",
    "0px 1px 10px 0px #0000001f, 0px 4px 5px 0px #00000024, 0px 2px 4px -1px #00000033",
    "0px 1px 14px 0px #0000001f, 0px 5px 8px 0px #00000024, 0px 3px 5px -1px #00000033",
    "0px 1px 18px 0px #0000001f, 0px 6px 10px 0px #00000024, 0px 3px 5px -1px #00000033",
    "0px 2px 16px 1px #0000001f, 0px 7px 10px 1px #00000024, 0px 4px 5px -2px #00000033",
    "0px 3px 14px 2px #0000001f, 0px 8px 10px 1px #00000024, 0px 5px 5px -3px #00000033",
    "0px 3px 16px 2px #0000001f, 0px 9px 12px 1px #00000024, 0px 5px 6px -3px #00000033",
    "0px 4px 18px 3px #0000001f, 0px 10px 14px 1px #00000024, 0px 6px 6px -3px #00000033",
    "0px 4px 20px 3px #0000001f, 0px 11px 15px 1px #00000024, 0px 6px 7px -4px #00000033",
    "0px 5px 22px 4px #0000001f, 0px 12px 17px 2px #00000024, 0px 7px 8px -4px #00000033",
    "0px 5px 24px 4px #0000001f, 0px 13px 19px 2px #00000024, 0px 7px 8px -4px #00000033",
    "0px 5px 26px 4px #0000001f, 0px 14px 21px 2px #00000024, 0px 7px 9px -4px #00000033",
    "0px 6px 28px 5px #0000001f, 0px 15px 22px 2px #00000024, 0px 8px 9px -5px #00000033",
    "0px 6px 30px 5px #0000001f, 0px 16px 24px 2px #00000024, 0px 8px 10px -5px #00000033",
    "0px 6px 32px 5px #0000001f, 0px 17px 26px 2px #00000024, 0px 8px 11px -5px #00000033",
    "0px 7px 34px 6px #0000001f, 0px 18px 28px 2px #00000024, 0px 9px 11px -5px #00000033",
    "0px 7px 36px 6px #0000001f, 0px 19px 29px 2px #00000024, 0px 9px 12px -6px #00000033",
    "0px 8px 38px 7px #0000001f, 0px 20px 31px 3px #00000024, 0px 10px 13px -6px #00000033",
    "0px 8px 40px 7px #0000001f, 0px 21px 33px 3px #00000024, 0px 10px 13px -6px #00000033",
    "0px 8px 42px 7px #0000001f, 0px 22px 35px 3px #00000024, 0px 10px 14px -6px #00000033",
    "0px 9px 44px 8px #0000001f, 0px 23px 36px 3px #00000024, 0px 11px 14px -7px #00000033",
    "0px 9px 46px 8px #0000001f, 0px 24px 38px 3px #00000024, 0px 11px 15px -7px #00000033"
  ],
  "components": {
    "MuiChip": {
      "styleOverrides": {
        "label": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": 1.2
        },
        "root": {
          "&.MuiChip-filled.MuiChip-colorPrimary": {
            "backgroundColor": "#7c4dff1a",
            "color": "#651fff",
            "& .MuiChip-icon, & .MuiChip-deleteIcon": {
              "color": "#651fff"
            }
          },
          "&.MuiChip-filled.MuiChip-colorSecondary": {
            "backgroundColor": "#1212121a",
            "color": "#212121",
            "& .MuiChip-icon, & .MuiChip-deleteIcon": {
              "color": "#212121"
            }
          },
          "&.MuiChip-filled.MuiChip-colorError": {
            "backgroundColor": "#ff17441a",
            "color": "#ff1744",
            "& .MuiChip-icon, & .MuiChip-deleteIcon": {
              "color": "#ff1744"
            }
          },
          "&.MuiChip-filled.MuiChip-colorWarning": {
            "backgroundColor": "#ff783c1a",
            "color": "#ff6114",
            "& .MuiChip-icon, & .MuiChip-deleteIcon": {
              "color": "#ff6114"
            }
          },
          "&.MuiChip-filled.MuiChip-colorInfo": {
            "backgroundColor": "#0291fe1a",
            "color": "#0291fe",
            "& .MuiChip-icon, & .MuiChip-deleteIcon": {
              "color": "#0291fe"
            }
          },
          "&.MuiChip-filled.MuiChip-colorSuccess": {
            "backgroundColor": "#00a5671a",
            "color": "#00a567",
            "& .MuiChip-icon, & .MuiChip-deleteIcon": {
              "color": "#00a567"
            }
          }
        }
      }
    },
    "MuiTooltip": {
      "styleOverrides": {
        "tooltip": {
          "fontSize": "0.625rem",
          "fontWeight": 500,
          "lineHeight": "14px"
        }
      }
    },
    "MuiBadge": {
      "styleOverrides": {
        "badge": {
          "fontSize": "0.75rem",
          "fontWeight": 500,
          "lineHeight": "20px"
        }
      }
    },
    "MuiAlert": {
      "styleOverrides": {
        "message": {
          "fontSize": "1rem",
          "fontWeight": 500,
          "lineHeight": 1.5
        }
      }
    },
    "MuiFormHelperText": {
      "styleOverrides": {
        "root": {
          "fontSize": "0.75rem",
          "fontWeight": 400,
          "lineHeight": 1.3
        }
      }
    },
    "MuiFormControlLabel": {
      "styleOverrides": {
        "label": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": 1.5
        }
      }
    },
    "MuiFormLabel": {
      "styleOverrides": {
        "root": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": 1.5
        }
      }
    },
    "MuiInputLabel": {
      "styleOverrides": {
        "root": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": "24px",
          "&.MuiInputLabel-sizeLarge": {
            "fontSize": "0.9375rem",
            "fontWeight": 400,
            "lineHeight": "24px"
          },
          "&.MuiInputLabel-outlined.MuiInputLabel-shrink, &.MuiInputLabel-filled.MuiInputLabel-shrink, &.MuiInputLabel-filled.Mui-focused": {
            "fontSize": "0.75rem",
            "fontWeight": 400,
            "lineHeight": "12px",
            "transform": "translate(14px, -6px) scale(1)"
          },
          "&.MuiInputLabel-standard.MuiInputLabel-shrink": {
            "fontSize": "0.75rem",
            "fontWeight": 400,
            "lineHeight": "12px",
            "transform": "translate(0, 0px) scale(1)"
          },
          "&.MuiInputLabel-sizeSmall.MuiInputLabel-outlined.MuiInputLabel-shrink, &.MuiInputLabel-sizeSmall.MuiInputLabel-filled.MuiInputLabel-shrink": {
            "fontSize": "0.75rem",
            "fontWeight": 400,
            "lineHeight": "12px",
            "transform": "translate(14px, -6px) scale(1)"
          },
          "&.MuiInputLabel-sizeSmall.MuiInputLabel-standard.MuiInputLabel-shrink": {
            "fontSize": "0.75rem",
            "fontWeight": 400,
            "lineHeight": "12px",
            "transform": "translate(0, 0px) scale(1)"
          },
          "&.MuiInputLabel-outlined, &.MuiInputLabel-filled": {
            "transform": "translate(14px, 7px) scale(1)"
          },
          "&.MuiInputLabel-standard": {
            "transform": "translate(0, 10px) scale(1)"
          },
          "&.MuiInputLabel-sizeSmall.MuiInputLabel-outlined, &.MuiInputLabel-sizeSmall.MuiInputLabel-filled": {
            "transform": "translate(14px, 5px) scale(1)"
          },
          "&.MuiInputLabel-sizeSmall.MuiInputLabel-standard": {
            "transform": "translate(0, 9px) scale(1)"
          },
          "variants": [
            {
              "props": {
                "size": "small"
              },
              "style": {
                "&.MuiInputLabel-outlined, &.MuiInputLabel-filled": {
                  "transform": "translate(14px, 5px) scale(1)"
                },
                "&.MuiInputLabel-standard": {
                  "transform": "translate(0, 9px) scale(1)"
                }
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "&.MuiInputLabel-outlined, &.MuiInputLabel-filled": {
                  "transform": "translate(14px, 10px) scale(1)"
                },
                "&.MuiInputLabel-standard": {
                  "transform": "translate(0, 14px) scale(1)"
                }
              }
            }
          ]
        }
      }
    },
    "MuiOutlinedInput": {
      "styleOverrides": {
        "input": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": "24px"
        },
        "root": {
          "&.MuiInputBase-sizeLarge": {
            "& .MuiOutlinedInput-input": {
              "fontSize": "0.9375rem",
              "fontWeight": 400,
              "lineHeight": "24px",
              "paddingBlock": "10px",
              "height": "auto"
            },
            "minHeight": "42px"
          },
          "&.MuiInputBase-sizeSmall": {
            "minHeight": "30px",
            "& .MuiOutlinedInput-input": {
              "paddingBlock": "5px",
              "height": "auto"
            }
          },
          "&.MuiInputBase-sizeMedium": {
            "minHeight": "36px",
            "& .MuiOutlinedInput-input": {
              "paddingBlock": "7px",
              "height": "auto"
            }
          },
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            "borderColor": "#0000001f",
            "backgroundColor": "#0000000f"
          },
          "variants": [
            {
              "props": {
                "size": "small"
              },
              "style": {
                "minHeight": "30px",
                "& .MuiOutlinedInput-input": {
                  "paddingBlock": "5px",
                  "height": "auto"
                }
              }
            },
            {
              "props": {
                "size": "medium"
              },
              "style": {
                "minHeight": "36px",
                "& .MuiOutlinedInput-input": {
                  "paddingBlock": "7px",
                  "height": "auto"
                }
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "minHeight": "42px",
                "& .MuiOutlinedInput-input": {
                  "paddingBlock": "10px",
                  "height": "auto"
                }
              }
            }
          ]
        },
        "notchedOutline": {
          "& legend": {
            "fontSize": "12px"
          }
        }
      }
    },
    "MuiFilledInput": {
      "styleOverrides": {
        "input": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": "24px"
        },
        "root": {
          "&.MuiInputBase-sizeLarge": {
            "& .MuiFilledInput-input": {
              "fontSize": "0.9375rem",
              "fontWeight": 400,
              "lineHeight": "24px"
            }
          },
          "variants": [
            {
              "props": {
                "size": "small"
              },
              "style": {
                "minHeight": "30px",
                "& .MuiFilledInput-input": {
                  "paddingBlock": "5px",
                  "height": "auto"
                }
              }
            },
            {
              "props": {
                "size": "medium"
              },
              "style": {
                "minHeight": "36px",
                "& .MuiFilledInput-input": {
                  "paddingBlock": "7px",
                  "height": "auto"
                }
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "minHeight": "42px",
                "& .MuiFilledInput-input": {
                  "paddingBlock": "10px",
                  "height": "auto"
                }
              }
            }
          ]
        }
      }
    },
    "MuiInput": {
      "styleOverrides": {
        "input": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": "24px"
        },
        "root": {
          "&.MuiInputBase-sizeLarge": {
            "& .MuiInput-input": {
              "fontSize": "0.9375rem",
              "fontWeight": 400,
              "lineHeight": "24px"
            }
          },
          "variants": [
            {
              "props": {
                "size": "small"
              },
              "style": {
                "minHeight": "30px",
                "& .MuiInput-input": {
                  "paddingBlock": "5px",
                  "height": "auto"
                }
              }
            },
            {
              "props": {
                "size": "medium"
              },
              "style": {
                "minHeight": "36px",
                "& .MuiInput-input": {
                  "paddingBlock": "7px",
                  "height": "auto"
                }
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "minHeight": "42px",
                "& .MuiInput-input": {
                  "paddingBlock": "10px",
                  "height": "auto"
                }
              }
            }
          ]
        }
      }
    },
    "MuiSelect": {
      "styleOverrides": {
        "select": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": "24px",
          "variants": [
            {
              "props": {
                "size": "small"
              },
              "style": {
                "minHeight": "30px",
                "paddingBlock": "5px"
              }
            },
            {
              "props": {
                "size": "medium"
              },
              "style": {
                "minHeight": "36px",
                "paddingBlock": "7px"
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "minHeight": "42px",
                "paddingBlock": "10px"
              }
            }
          ]
        },
        "root": {
          "&.MuiInputBase-sizeLarge": {
            "& .MuiSelect-select": {
              "fontSize": "0.9375rem",
              "fontWeight": 400,
              "lineHeight": "24px"
            }
          }
        },
        "icon": {
          "variants": [
            {
              "props": {
                "size": "small"
              },
              "style": {
                "fontSize": "1.25rem"
              }
            },
            {
              "props": {
                "size": "medium"
              },
              "style": {
                "fontSize": "1.5rem"
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "fontSize": "1.75rem"
              }
            }
          ]
        }
      }
    },
    "MuiButton": {
      "variants": [
        {
          "props": {
            "size": "large"
          },
          "style": {
            "fontSize": "0.9375rem",
            "fontWeight": 500,
            "lineHeight": "26px",
            "textTransform": "uppercase",
            "minHeight": "42px"
          }
        },
        {
          "props": {
            "size": "medium"
          },
          "style": {
            "fontSize": "0.8125rem",
            "fontWeight": 500,
            "lineHeight": "24px",
            "textTransform": "uppercase",
            "minHeight": "36px"
          }
        },
        {
          "props": {
            "size": "small"
          },
          "style": {
            "fontSize": "0.8125rem",
            "fontWeight": 500,
            "lineHeight": "20px",
            "textTransform": "uppercase",
            "minHeight": "30px"
          }
        },
        {
          "props": {
            "size": "xsmall"
          },
          "style": {
            "fontSize": "0.75rem",
            "lineHeight": "20px",
            "minWidth": 0,
            "minHeight": "24px"
          }
        },
        {
          "props": {
            "size": "xsmall",
            "variant": "text"
          },
          "style": {
            "padding": "2px 4px"
          }
        },
        {
          "props": {
            "size": "xsmall",
            "variant": "contained"
          },
          "style": {
            "padding": "2px 6px"
          }
        },
        {
          "props": {
            "size": "xsmall",
            "variant": "outlined"
          },
          "style": {
            "padding": "1px 5px"
          }
        }
      ],
      "styleOverrides": {
        "root": {
          "boxShadow": "none",
          "&:hover": {
            "boxShadow": "none"
          },
          "&:active": {
            "boxShadow": "none"
          },
          "&.Mui-focusVisible": {
            "boxShadow": "none"
          }
        }
      }
    },
    "MuiToggleButton": {
      "styleOverrides": {
        "sizeLarge": {
          "fontSize": "0.9375rem",
          "fontWeight": 500,
          "lineHeight": "26px",
          "textTransform": "none",
          "minHeight": "42px",
          "height": "42px",
          "padding": "8px 14px"
        },
        "sizeMedium": {
          "fontSize": "0.8125rem",
          "fontWeight": 500,
          "lineHeight": "24px",
          "textTransform": "none",
          "minHeight": "36px",
          "height": "36px",
          "padding": "6px 12px"
        },
        "sizeSmall": {
          "fontSize": "0.8125rem",
          "fontWeight": 500,
          "lineHeight": "20px",
          "textTransform": "none",
          "minHeight": "30px",
          "height": "30px",
          "padding": "4px 12px"
        },
        "root": {
          "textTransform": "none",
          "whiteSpace": "nowrap"
        }
      }
    },
    "MuiIconButton": {
      "styleOverrides": {
        "root": {
          "variants": [
            {
              "props": {
                "size": "xsmall"
              },
              "style": {
                "width": "24px",
                "height": "24px",
                "fontSize": "1rem"
              }
            },
            {
              "props": {
                "size": "small"
              },
              "style": {
                "width": "30px",
                "height": "30px"
              }
            },
            {
              "props": {
                "size": "medium"
              },
              "style": {
                "width": "36px",
                "height": "36px"
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "width": "42px",
                "height": "42px"
              }
            }
          ]
        }
      }
    },
    "MuiTextField": {
      "styleOverrides": {
        "root": {
          "verticalAlign": "top",
          "& .MuiFormHelperText-root": {
            "marginTop": "2px",
            "marginLeft": 0,
            "marginRight": 0,
            "lineHeight": 1.2
          },
          "variants": [
            {
              "props": {
                "size": "small"
              },
              "style": {
                "& .MuiInputBase-root": {
                  "minHeight": "30px"
                }
              }
            },
            {
              "props": {
                "size": "medium"
              },
              "style": {
                "& .MuiInputBase-root": {
                  "minHeight": "36px"
                }
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "& .MuiInputBase-root": {
                  "minHeight": "42px"
                }
              }
            }
          ]
        }
      }
    },
    "MuiButtonGroup": {
      "styleOverrides": {
        "root": {
          "alignItems": "stretch"
        }
      }
    },
    "MuiToggleButtonGroup": {
      "styleOverrides": {
        "root": {
          "alignItems": "stretch",
          "& .MuiToggleButtonGroup-grouped.MuiToggleButton-sizeSmall": {
            "minHeight": "30px",
            "height": "30px"
          },
          "& .MuiToggleButtonGroup-grouped.MuiToggleButton-sizeMedium": {
            "minHeight": "36px",
            "height": "36px"
          },
          "& .MuiToggleButtonGroup-grouped.MuiToggleButton-sizeLarge": {
            "minHeight": "42px",
            "height": "42px"
          }
        },
        "grouped": {
          "minHeight": "inherit"
        }
      }
    },
    "MuiTableCell": {
      "styleOverrides": {
        "head": {
          "backgroundColor": "#0000000a"
        }
      }
    },
    "MuiDialogTitle": {
      "styleOverrides": {
        "root": {
          "fontSize": "18px"
        }
      }
    },
    "MuiDialogContent": {
      "styleOverrides": {
        "root": {
          "padding": "24px"
        }
      }
    },
    "MuiDialogActions": {
      "styleOverrides": {
        "root": {
          "padding": "12px 24px"
        }
      }
    }
  },
  "brand": {
    "colors": {
      "hecto": {
        "orange": {
          "50": "#fceae7",
          "100": "#ffcebb",
          "200": "#ffaf8f",
          "300": "#ff9061",
          "400": "#ff783c",
          "500": "#ff6114",
          "600": "#f45c0f",
          "700": "#e65509",
          "800": "#d84e05",
          "900": "#c04000"
        },
        "grey": {
          "50": "#f5f5f5",
          "100": "#e9e9e9",
          "200": "#d9d9d9",
          "300": "#c4c4c4",
          "400": "#9d9d9d",
          "500": "#7b7b7b",
          "600": "#555555",
          "700": "#434343",
          "800": "#262626",
          "900": "#121212"
        },
        "blue": {
          "50": "#e2f1ff",
          "100": "#badcff",
          "200": "#8dc8ff",
          "300": "#5cb2ff",
          "400": "#36a1ff",
          "500": "#0291fe",
          "600": "#0e83ef",
          "700": "#1270dc",
          "800": "#145fc9",
          "900": "#1440aa"
        },
        "lime": {
          "50": "#f9ffe8",
          "100": "#f0fec4",
          "200": "#e4fe9a",
          "300": "#e1ff71",
          "400": "#d9ff4b",
          "500": "#cfff1e",
          "600": "#c3eb11",
          "700": "#b3d400",
          "800": "#a5bc00",
          "900": "#8e9300"
        },
        "indigo": {
          "50": "#e7e9f8",
          "100": "#c3c8ed",
          "200": "#9aa4e0",
          "300": "#7181d4",
          "400": "#5065cb",
          "500": "#2a49c1",
          "600": "#2441b7",
          "700": "#1837ab",
          "800": "#082d9f",
          "900": "#00198c"
        },
        "green": {
          "50": "#e0f6ee",
          "100": "#b2e9d4",
          "200": "#7cdab9",
          "300": "#25cc9c",
          "400": "#00c087",
          "500": "#00b473",
          "600": "#00a567",
          "700": "#009259",
          "800": "#00814c",
          "900": "#006135"
        },
        "deepgreen": {
          "50": "#dff1f1",
          "100": "#b0dbda",
          "200": "#7dc5c3",
          "300": "#4aaeaa",
          "400": "#249d97",
          "500": "#028c85",
          "600": "#027f78",
          "700": "#037068",
          "800": "#056059",
          "900": "#06443c"
        }
      }
    },
    "sizes": {
      "logo": {
        "small": 20,
        "medium": 24,
        "large": 28,
        "extraLarge": 50
      }
    }
  },
  "palette": {
    "mode": "light",
    "primary": {
      "light": "#a288ff",
      "main": "#651fff",
      "dark": "#6200ea",
      "contrastText": "#ffffff",
      "_states": {
        "hover": "#7c4dff0a",
        "selected": "#7c4dff1a",
        "focusVisible": "#7c4dff4d",
        "outlinedBorder": "#7c4dff80",
        "focus": "#7c4dff1f"
      }
    },
    "secondary": {
      "light": "#555555",
      "main": "#212121",
      "dark": "#000000",
      "contrastText": "#ffffff",
      "_states": {
        "hover": "#1212120a",
        "selected": "#1212121a",
        "focusVisible": "#1212124d",
        "outlinedBorder": "#12121280",
        "focus": "#1212121f"
      }
    },
    "error": {
      "light": "#ff5252",
      "main": "#ff1744",
      "dark": "#d50000",
      "contrastText": "#ffffff",
      "_states": {
        "hover": "#ff17440a",
        "selected": "#ff17441a",
        "focusVisible": "#ff17444d",
        "outlinedBorder": "#ff174480"
      }
    },
    "warning": {
      "light": "#ff9061",
      "main": "#ff6114",
      "dark": "#d84e05",
      "contrastText": "#ffffff",
      "_states": {
        "hover": "#ff783c0a",
        "selected": "#ff783c1a",
        "focusVisible": "#ff783c4d",
        "outlinedBorder": "#ff783c80"
      }
    },
    "info": {
      "light": "#5cb2ff",
      "main": "#0291fe",
      "dark": "#1270dc",
      "contrastText": "#ffffff",
      "_states": {
        "hover": "#0291fe0a",
        "selected": "#0291fe1a",
        "focusVisible": "#0291fe4d",
        "outlinedBorder": "#0291fe80"
      }
    },
    "success": {
      "light": "#25cc9c",
      "main": "#00a567",
      "dark": "#00814c",
      "contrastText": "#ffffff",
      "_states": {
        "hover": "#00a5670a",
        "selected": "#00a5671a",
        "focusVisible": "#00a5674d",
        "outlinedBorder": "#00a56780"
      }
    },
    "text": {
      "primary": "#212121",
      "secondary": "#00000099",
      "disabled": "#00000066"
    },
    "background": {
      "default": "#ffffff",
      "paper": "#ffffff"
    },
    "action": {
      "active": "#00000099",
      "hover": "#0000000a",
      "selected": "#0000001a",
      "disabled": "#00000066",
      "disabledBackground": "#0000000f",
      "focus": "#0000001f"
    },
    "common": {
      "white": "#ffffff",
      "black": "#000000"
    },
    "divider": "#0000001f",
    "_components": {
      "appBar": {
        "defaultFill": "#e9e9e9",
        "darkFill": "#212121"
      }
    },
    "hecto": {
      "orange": {
        "50": "#fceae7",
        "100": "#ffcebb",
        "200": "#ffaf8f",
        "300": "#ff9061",
        "400": "#ff783c",
        "500": "#ff6114",
        "600": "#f45c0f",
        "700": "#e65509",
        "800": "#d84e05",
        "900": "#c04000"
      },
      "grey": {
        "50": "#f5f5f5",
        "100": "#e9e9e9",
        "200": "#d9d9d9",
        "300": "#c4c4c4",
        "400": "#9d9d9d",
        "500": "#7b7b7b",
        "600": "#555555",
        "700": "#434343",
        "800": "#262626",
        "900": "#121212"
      },
      "blue": {
        "50": "#e2f1ff",
        "100": "#badcff",
        "200": "#8dc8ff",
        "300": "#5cb2ff",
        "400": "#36a1ff",
        "500": "#0291fe",
        "600": "#0e83ef",
        "700": "#1270dc",
        "800": "#145fc9",
        "900": "#1440aa"
      },
      "lime": {
        "50": "#f9ffe8",
        "100": "#f0fec4",
        "200": "#e4fe9a",
        "300": "#e1ff71",
        "400": "#d9ff4b",
        "500": "#cfff1e",
        "600": "#c3eb11",
        "700": "#b3d400",
        "800": "#a5bc00",
        "900": "#8e9300"
      },
      "indigo": {
        "50": "#e7e9f8",
        "100": "#c3c8ed",
        "200": "#9aa4e0",
        "300": "#7181d4",
        "400": "#5065cb",
        "500": "#2a49c1",
        "600": "#2441b7",
        "700": "#1837ab",
        "800": "#082d9f",
        "900": "#00198c"
      },
      "green": {
        "50": "#e0f6ee",
        "100": "#b2e9d4",
        "200": "#7cdab9",
        "300": "#25cc9c",
        "400": "#00c087",
        "500": "#00b473",
        "600": "#00a567",
        "700": "#009259",
        "800": "#00814c",
        "900": "#006135"
      },
      "deepgreen": {
        "50": "#dff1f1",
        "100": "#b0dbda",
        "200": "#7dc5c3",
        "300": "#4aaeaa",
        "400": "#249d97",
        "500": "#028c85",
        "600": "#027f78",
        "700": "#037068",
        "800": "#056059",
        "900": "#06443c"
      }
    }
  }
} as ThemeOptions;

export const darkThemeOptions: ThemeOptions = {
  "_library": {
    "clickableLayer": {
      "$type": "color",
      "$value": "#00000000"
    },
    "colorHighlight": {
      "$type": "color",
      "$value": "#9747ff"
    },
    "fillHighlight": {
      "$type": "color",
      "$value": "#9747ff0a"
    },
    "heading": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.36}",
        "fontSize": "{fontSize.10}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "elevation": {
    "1": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 1,
          "blur": 3,
          "spread": 0
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 1,
          "blur": 1,
          "spread": 0
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 2,
          "blur": 1,
          "spread": -1
        }
      ]
    },
    "2": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 1,
          "blur": 5,
          "spread": 0
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 2,
          "blur": 2,
          "spread": 0
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 3,
          "blur": 1,
          "spread": -2
        }
      ]
    },
    "3": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 1,
          "blur": 8,
          "spread": 0
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 3,
          "blur": 4,
          "spread": 0
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 3,
          "blur": 3,
          "spread": -2
        }
      ]
    },
    "4": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 1,
          "blur": 10,
          "spread": 0
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 4,
          "blur": 5,
          "spread": 0
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 2,
          "blur": 4,
          "spread": -1
        }
      ]
    },
    "5": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 1,
          "blur": 14,
          "spread": 0
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 5,
          "blur": 8,
          "spread": 0
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 3,
          "blur": 5,
          "spread": -1
        }
      ]
    },
    "6": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 1,
          "blur": 18,
          "spread": 0
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 6,
          "blur": 10,
          "spread": 0
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 3,
          "blur": 5,
          "spread": -1
        }
      ]
    },
    "7": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 2,
          "blur": 16,
          "spread": 1
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 7,
          "blur": 10,
          "spread": 1
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 4,
          "blur": 5,
          "spread": -2
        }
      ]
    },
    "8": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 3,
          "blur": 14,
          "spread": 2
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 8,
          "blur": 10,
          "spread": 1
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 5,
          "blur": 5,
          "spread": -3
        }
      ]
    },
    "9": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 3,
          "blur": 16,
          "spread": 2
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 9,
          "blur": 12,
          "spread": 1
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 5,
          "blur": 6,
          "spread": -3
        }
      ]
    },
    "10": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 4,
          "blur": 18,
          "spread": 3
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 10,
          "blur": 14,
          "spread": 1
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 6,
          "blur": 6,
          "spread": -3
        }
      ]
    },
    "11": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 4,
          "blur": 20,
          "spread": 3
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 11,
          "blur": 15,
          "spread": 1
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 6,
          "blur": 7,
          "spread": -4
        }
      ]
    },
    "12": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 5,
          "blur": 22,
          "spread": 4
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 12,
          "blur": 17,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 7,
          "blur": 8,
          "spread": -4
        }
      ]
    },
    "13": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 5,
          "blur": 24,
          "spread": 4
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 13,
          "blur": 19,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 7,
          "blur": 8,
          "spread": -4
        }
      ]
    },
    "14": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 5,
          "blur": 26,
          "spread": 4
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 14,
          "blur": 21,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 7,
          "blur": 9,
          "spread": -4
        }
      ]
    },
    "15": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 6,
          "blur": 28,
          "spread": 5
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 15,
          "blur": 22,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 8,
          "blur": 9,
          "spread": -5
        }
      ]
    },
    "16": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 6,
          "blur": 30,
          "spread": 5
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 16,
          "blur": 24,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 8,
          "blur": 10,
          "spread": -5
        }
      ]
    },
    "17": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 6,
          "blur": 32,
          "spread": 5
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 17,
          "blur": 26,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 8,
          "blur": 11,
          "spread": -5
        }
      ]
    },
    "18": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 7,
          "blur": 34,
          "spread": 6
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 18,
          "blur": 28,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 9,
          "blur": 11,
          "spread": -5
        }
      ]
    },
    "19": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 7,
          "blur": 36,
          "spread": 6
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 19,
          "blur": 29,
          "spread": 2
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 9,
          "blur": 12,
          "spread": -6
        }
      ]
    },
    "20": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 8,
          "blur": 38,
          "spread": 7
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 20,
          "blur": 31,
          "spread": 3
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 10,
          "blur": 13,
          "spread": -6
        }
      ]
    },
    "21": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 8,
          "blur": 40,
          "spread": 7
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 21,
          "blur": 33,
          "spread": 3
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 10,
          "blur": 13,
          "spread": -6
        }
      ]
    },
    "22": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 8,
          "blur": 42,
          "spread": 7
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 22,
          "blur": 35,
          "spread": 3
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 10,
          "blur": 14,
          "spread": -6
        }
      ]
    },
    "23": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 9,
          "blur": 44,
          "spread": 8
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 23,
          "blur": 36,
          "spread": 3
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 11,
          "blur": 14,
          "spread": -7
        }
      ]
    },
    "24": {
      "$type": "boxShadow",
      "$value": [
        {
          "color": "#0000001f",
          "type": "dropShadow",
          "x": 0,
          "y": 9,
          "blur": 46,
          "spread": 8
        },
        {
          "color": "#00000024",
          "type": "dropShadow",
          "x": 0,
          "y": 24,
          "blur": 38,
          "spread": 3
        },
        {
          "color": "#00000033",
          "type": "dropShadow",
          "x": 0,
          "y": 11,
          "blur": 15,
          "spread": -7
        }
      ]
    }
  },
  "fontFamilies": {
    "roboto": {
      "$type": "fontFamilies",
      "$value": "Roboto"
    }
  },
  "lineHeights": {
    "0": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "1": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "2": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "3": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "4": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "5": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "6": {
      "$type": "lineHeights",
      "$value": "150%"
    },
    "7": {
      "$type": "lineHeights",
      "$value": "150%"
    },
    "8": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "9": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "10": {
      "$type": "lineHeights",
      "$value": "266%"
    },
    "11": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "12": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "13": {
      "$type": "lineHeights",
      "$value": "150%"
    },
    "14": {
      "$type": "lineHeights",
      "$value": "143%"
    },
    "15": {
      "$type": "lineHeights",
      "$value": "100%"
    },
    "16": {
      "$type": "lineHeights",
      "$value": "100%"
    },
    "17": {
      "$type": "lineHeights",
      "$value": "100%"
    },
    "18": {
      "$type": "lineHeights",
      "$value": 20
    },
    "19": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "20": {
      "$type": "lineHeights",
      "$value": 26
    },
    "21": {
      "$type": "lineHeights",
      "$value": 24
    },
    "22": {
      "$type": "lineHeights",
      "$value": 20
    },
    "23": {
      "$type": "lineHeights",
      "$value": "120%"
    },
    "24": {
      "$type": "lineHeights",
      "$value": "150%"
    },
    "25": {
      "$type": "lineHeights",
      "$value": 12
    },
    "26": {
      "$type": "lineHeights",
      "$value": 24
    },
    "27": {
      "$type": "lineHeights",
      "$value": 24
    },
    "28": {
      "$type": "lineHeights",
      "$value": "130%"
    },
    "29": {
      "$type": "lineHeights",
      "$value": 36
    },
    "30": {
      "$type": "lineHeights",
      "$value": "150%"
    },
    "31": {
      "$type": "lineHeights",
      "$value": "150%"
    },
    "32": {
      "$type": "lineHeights",
      "$value": 20
    },
    "33": {
      "$type": "lineHeights",
      "$value": 24
    },
    "34": {
      "$type": "lineHeights",
      "$value": 14
    },
    "35": {
      "$type": "lineHeights",
      "$value": 12
    },
    "36": {
      "$type": "lineHeights",
      "$value": "116.7%"
    },
    "37": {
      "$type": "lineHeights",
      "$value": "166%"
    },
    "38": {
      "$type": "lineHeights",
      "$value": "166%"
    }
  },
  "fontWeights": {
    "pretendard-variable-0": {
      "$type": "fontWeights",
      "$value": "SemiBold"
    },
    "pretendard-variable-1": {
      "$type": "fontWeights",
      "$value": "Regular"
    },
    "pretendard-variable-2": {
      "$type": "fontWeights",
      "$value": "Medium"
    },
    "roboto-3": {
      "$type": "fontWeights",
      "$value": "Regular"
    }
  },
  "fontSize": {
    "0": {
      "$type": "fontSizes",
      "$value": 10
    },
    "1": {
      "$type": "fontSizes",
      "$value": 12
    },
    "2": {
      "$type": "fontSizes",
      "$value": 13
    },
    "3": {
      "$type": "fontSizes",
      "$value": 14
    },
    "4": {
      "$type": "fontSizes",
      "$value": 15
    },
    "5": {
      "$type": "fontSizes",
      "$value": 16
    },
    "6": {
      "$type": "fontSizes",
      "$value": 20
    },
    "7": {
      "$type": "fontSizes",
      "$value": 24
    },
    "8": {
      "$type": "fontSizes",
      "$value": 34
    },
    "9": {
      "$type": "fontSizes",
      "$value": 60
    },
    "10": {
      "$type": "fontSizes",
      "$value": 64
    },
    "33": {
      "$type": "fontSizes",
      "$value": "64"
    },
    "34": {
      "$type": "fontSizes",
      "$value": "12"
    }
  },
  "letterSpacing": {
    "0": {
      "$type": "letterSpacing",
      "$value": 0
    },
    "1": {
      "$type": "letterSpacing",
      "$value": 0.15
    },
    "2": {
      "$type": "letterSpacing",
      "$value": "0%"
    },
    "3": {
      "$type": "letterSpacing",
      "$value": "0%"
    },
    "4": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "5": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "6": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "7": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "8": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "9": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "10": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "11": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "12": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "13": {
      "$type": "letterSpacing",
      "$value": "0.15"
    },
    "14": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "15": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "16": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "17": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "18": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "19": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "20": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "21": {
      "$type": "letterSpacing",
      "$value": "0.46"
    },
    "22": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "23": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "24": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "25": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "26": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "27": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "28": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "29": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "30": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "31": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "32": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "33": {
      "$type": "letterSpacing",
      "$value": "0"
    },
    "34": {
      "$type": "letterSpacing",
      "$value": "0"
    }
  },
  "paragraphSpacing": {
    "0": {
      "$type": "paragraphSpacing",
      "$value": 0
    },
    "1": {
      "$type": "paragraphSpacing",
      "$value": 12
    },
    "2": {
      "$type": "paragraphSpacing",
      "$value": 20
    },
    "3": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "4": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "5": {
      "$type": "paragraphSpacing",
      "$value": "20"
    },
    "6": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "7": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "8": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "9": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "10": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "11": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "12": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "13": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "14": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "15": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "16": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "17": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "18": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "19": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "20": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "21": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "22": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "23": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "24": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "25": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "26": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "27": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "28": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "29": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "30": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "31": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "32": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "33": {
      "$type": "paragraphSpacing",
      "$value": "0"
    },
    "34": {
      "$type": "paragraphSpacing",
      "$value": "12"
    }
  },
  "typography": {
    "fontFamily": "Pretendard Variable, '맑은 고딕', -apple-system, 'Roboto', 'Arial', sans-serif",
    "h1": {
      "fontSize": "3.75rem",
      "fontWeight": 600,
      "lineHeight": 1.2
    },
    "h2": {
      "fontSize": "2.125rem",
      "fontWeight": 600,
      "lineHeight": 1.2
    },
    "h3": {
      "fontSize": "1.5rem",
      "fontWeight": 600,
      "lineHeight": 1.2
    },
    "h4": {
      "fontSize": "1.25rem",
      "fontWeight": 600,
      "lineHeight": 1.2
    },
    "h5": {
      "fontSize": "1rem",
      "fontWeight": 600,
      "lineHeight": 1.2
    },
    "h6": {
      "fontSize": "0.875rem",
      "fontWeight": 600,
      "lineHeight": 1.2
    },
    "body1": {
      "fontSize": "0.875rem",
      "fontWeight": 400,
      "lineHeight": 1.5
    },
    "body2": {
      "fontSize": "0.8125rem",
      "fontWeight": 400,
      "lineHeight": 1.5
    },
    "subtitle1": {
      "fontSize": "1rem",
      "fontWeight": 500,
      "lineHeight": 1.2
    },
    "subtitle2": {
      "fontSize": "0.875rem",
      "fontWeight": 500,
      "lineHeight": 1.2
    },
    "caption": {
      "fontSize": "0.75rem",
      "fontWeight": 400,
      "lineHeight": 1.2
    },
    "overline": {
      "fontSize": "0.75rem",
      "fontWeight": 400,
      "lineHeight": 2.66,
      "textTransform": "uppercase"
    }
  },
  "alert": {
    "title": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.6}",
        "fontSize": "{fontSize.5}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "description": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.14}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.1}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "avatar": {
    "initialsLg": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.15}",
        "fontSize": "{fontSize.6}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "initialsSm": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.15}",
        "fontSize": "{fontSize.0}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "initialsMd": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.15}",
        "fontSize": "{fontSize.1}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "badge": {
    "label": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.18}",
        "fontSize": "{fontSize.1}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "bottomNavigation": {
    "activeLabel": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.0}",
        "fontSize": "{fontSize.3}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "button": {
    "large": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.20}",
        "fontSize": "{fontSize.4}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.uppercase}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "medium": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.21}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.uppercase}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "small": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.18}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.uppercase}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "chip": {
    "label": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.0}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "datePicker": {
    "currentMonth": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.6}",
        "fontSize": "{fontSize.5}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "input": {
    "label": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.25}",
        "fontSize": "{fontSize.1}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "value": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.21}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "helper": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.28}",
        "fontSize": "{fontSize.1}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "valueLarge": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.21}",
        "fontSize": "{fontSize.4}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "list": {
    "subheader": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.29}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "menu": {
    "itemDefault": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.6}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "itemDense": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.6}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    },
    "itemSmall": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-1}",
        "lineHeight": "{lineHeights.18}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.2}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "table": {
    "header": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.21}",
        "fontSize": "{fontSize.2}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "tooltip": {
    "label": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.34}",
        "fontSize": "{fontSize.0}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "dataGrid": {
    "aggregationColumnHeaderLabel": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamily.primary}",
        "fontWeight": "{fontWeights.pretendard-variable-2}",
        "lineHeight": "{lineHeights.25}",
        "fontSize": "{fontSize.1}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.0}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.uppercase}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "charts": {
    "group": {
      "$type": "typography",
      "$value": {
        "fontFamily": "{fontFamilies.roboto}",
        "fontWeight": "{fontWeights.roboto-3}",
        "lineHeight": "{lineHeights.37}",
        "fontSize": "{fontSize.1}",
        "letterSpacing": "{letterSpacing.0}",
        "paragraphSpacing": "{paragraphSpacing.1}",
        "paragraphIndent": "{paragraphIndent.0}",
        "textCase": "{textCase.none}",
        "textDecoration": "{textDecoration.none}"
      }
    }
  },
  "textCase": {
    "none": {
      "$type": "textCase",
      "$value": "none"
    },
    "uppercase": {
      "$type": "textCase",
      "$value": "uppercase"
    }
  },
  "textDecoration": {
    "none": {
      "$type": "textDecoration",
      "$value": "none"
    }
  },
  "paragraphIndent": {
    "0": {
      "$type": "dimension",
      "$value": "0px"
    }
  },
  "spacing": 8,
  "breakpoints": {
    "values": {
      "xs": 444,
      "sm": 600,
      "md": 900,
      "lg": 1200,
      "xl": 1536
    }
  },
  "shape": {
    "borderRadius": 4
  },
  "shadows": [
    "none",
    "0px 1px 3px 0px #0000001f, 0px 1px 1px 0px #00000024, 0px 2px 1px -1px #00000033",
    "0px 1px 5px 0px #0000001f, 0px 2px 2px 0px #00000024, 0px 3px 1px -2px #00000033",
    "0px 1px 8px 0px #0000001f, 0px 3px 4px 0px #00000024, 0px 3px 3px -2px #00000033",
    "0px 1px 10px 0px #0000001f, 0px 4px 5px 0px #00000024, 0px 2px 4px -1px #00000033",
    "0px 1px 14px 0px #0000001f, 0px 5px 8px 0px #00000024, 0px 3px 5px -1px #00000033",
    "0px 1px 18px 0px #0000001f, 0px 6px 10px 0px #00000024, 0px 3px 5px -1px #00000033",
    "0px 2px 16px 1px #0000001f, 0px 7px 10px 1px #00000024, 0px 4px 5px -2px #00000033",
    "0px 3px 14px 2px #0000001f, 0px 8px 10px 1px #00000024, 0px 5px 5px -3px #00000033",
    "0px 3px 16px 2px #0000001f, 0px 9px 12px 1px #00000024, 0px 5px 6px -3px #00000033",
    "0px 4px 18px 3px #0000001f, 0px 10px 14px 1px #00000024, 0px 6px 6px -3px #00000033",
    "0px 4px 20px 3px #0000001f, 0px 11px 15px 1px #00000024, 0px 6px 7px -4px #00000033",
    "0px 5px 22px 4px #0000001f, 0px 12px 17px 2px #00000024, 0px 7px 8px -4px #00000033",
    "0px 5px 24px 4px #0000001f, 0px 13px 19px 2px #00000024, 0px 7px 8px -4px #00000033",
    "0px 5px 26px 4px #0000001f, 0px 14px 21px 2px #00000024, 0px 7px 9px -4px #00000033",
    "0px 6px 28px 5px #0000001f, 0px 15px 22px 2px #00000024, 0px 8px 9px -5px #00000033",
    "0px 6px 30px 5px #0000001f, 0px 16px 24px 2px #00000024, 0px 8px 10px -5px #00000033",
    "0px 6px 32px 5px #0000001f, 0px 17px 26px 2px #00000024, 0px 8px 11px -5px #00000033",
    "0px 7px 34px 6px #0000001f, 0px 18px 28px 2px #00000024, 0px 9px 11px -5px #00000033",
    "0px 7px 36px 6px #0000001f, 0px 19px 29px 2px #00000024, 0px 9px 12px -6px #00000033",
    "0px 8px 38px 7px #0000001f, 0px 20px 31px 3px #00000024, 0px 10px 13px -6px #00000033",
    "0px 8px 40px 7px #0000001f, 0px 21px 33px 3px #00000024, 0px 10px 13px -6px #00000033",
    "0px 8px 42px 7px #0000001f, 0px 22px 35px 3px #00000024, 0px 10px 14px -6px #00000033",
    "0px 9px 44px 8px #0000001f, 0px 23px 36px 3px #00000024, 0px 11px 14px -7px #00000033",
    "0px 9px 46px 8px #0000001f, 0px 24px 38px 3px #00000024, 0px 11px 15px -7px #00000033"
  ],
  "components": {
    "MuiChip": {
      "styleOverrides": {
        "label": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": 1.2
        },
        "root": {
          "&.MuiChip-filled.MuiChip-colorPrimary": {
            "backgroundColor": "#a288ff29",
            "color": "#7c4dff",
            "& .MuiChip-icon, & .MuiChip-deleteIcon": {
              "color": "#7c4dff"
            }
          },
          "&.MuiChip-filled.MuiChip-colorSecondary": {
            "backgroundColor": "#ffffff29",
            "color": "#f5f5f5",
            "& .MuiChip-icon, & .MuiChip-deleteIcon": {
              "color": "#f5f5f5"
            }
          },
          "&.MuiChip-filled.MuiChip-colorError": {
            "backgroundColor": "#ff525229",
            "color": "#ff5252",
            "& .MuiChip-icon, & .MuiChip-deleteIcon": {
              "color": "#ff5252"
            }
          },
          "&.MuiChip-filled.MuiChip-colorWarning": {
            "backgroundColor": "#ff906129",
            "color": "#ff6114",
            "& .MuiChip-icon, & .MuiChip-deleteIcon": {
              "color": "#ff6114"
            }
          },
          "&.MuiChip-filled.MuiChip-colorInfo": {
            "backgroundColor": "#36a1ff29",
            "color": "#36a1ff",
            "& .MuiChip-icon, & .MuiChip-deleteIcon": {
              "color": "#36a1ff"
            }
          },
          "&.MuiChip-filled.MuiChip-colorSuccess": {
            "backgroundColor": "#00c08729",
            "color": "#00b473",
            "& .MuiChip-icon, & .MuiChip-deleteIcon": {
              "color": "#00b473"
            }
          }
        }
      }
    },
    "MuiTooltip": {
      "styleOverrides": {
        "tooltip": {
          "fontSize": "0.625rem",
          "fontWeight": 500,
          "lineHeight": "14px"
        }
      }
    },
    "MuiBadge": {
      "styleOverrides": {
        "badge": {
          "fontSize": "0.75rem",
          "fontWeight": 500,
          "lineHeight": "20px"
        }
      }
    },
    "MuiAlert": {
      "styleOverrides": {
        "message": {
          "fontSize": "1rem",
          "fontWeight": 500,
          "lineHeight": 1.5
        }
      }
    },
    "MuiFormHelperText": {
      "styleOverrides": {
        "root": {
          "fontSize": "0.75rem",
          "fontWeight": 400,
          "lineHeight": 1.3
        }
      }
    },
    "MuiFormControlLabel": {
      "styleOverrides": {
        "label": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": 1.5
        }
      }
    },
    "MuiFormLabel": {
      "styleOverrides": {
        "root": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": 1.5
        }
      }
    },
    "MuiInputLabel": {
      "styleOverrides": {
        "root": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": "24px",
          "&.MuiInputLabel-sizeLarge": {
            "fontSize": "0.9375rem",
            "fontWeight": 400,
            "lineHeight": "24px"
          },
          "&.MuiInputLabel-outlined.MuiInputLabel-shrink, &.MuiInputLabel-filled.MuiInputLabel-shrink, &.MuiInputLabel-filled.Mui-focused": {
            "fontSize": "0.75rem",
            "fontWeight": 400,
            "lineHeight": "12px",
            "transform": "translate(14px, -6px) scale(1)"
          },
          "&.MuiInputLabel-standard.MuiInputLabel-shrink": {
            "fontSize": "0.75rem",
            "fontWeight": 400,
            "lineHeight": "12px",
            "transform": "translate(0, 0px) scale(1)"
          },
          "&.MuiInputLabel-sizeSmall.MuiInputLabel-outlined.MuiInputLabel-shrink, &.MuiInputLabel-sizeSmall.MuiInputLabel-filled.MuiInputLabel-shrink": {
            "fontSize": "0.75rem",
            "fontWeight": 400,
            "lineHeight": "12px",
            "transform": "translate(14px, -6px) scale(1)"
          },
          "&.MuiInputLabel-sizeSmall.MuiInputLabel-standard.MuiInputLabel-shrink": {
            "fontSize": "0.75rem",
            "fontWeight": 400,
            "lineHeight": "12px",
            "transform": "translate(0, 0px) scale(1)"
          },
          "&.MuiInputLabel-outlined, &.MuiInputLabel-filled": {
            "transform": "translate(14px, 7px) scale(1)"
          },
          "&.MuiInputLabel-standard": {
            "transform": "translate(0, 10px) scale(1)"
          },
          "&.MuiInputLabel-sizeSmall.MuiInputLabel-outlined, &.MuiInputLabel-sizeSmall.MuiInputLabel-filled": {
            "transform": "translate(14px, 5px) scale(1)"
          },
          "&.MuiInputLabel-sizeSmall.MuiInputLabel-standard": {
            "transform": "translate(0, 9px) scale(1)"
          },
          "variants": [
            {
              "props": {
                "size": "small"
              },
              "style": {
                "&.MuiInputLabel-outlined, &.MuiInputLabel-filled": {
                  "transform": "translate(14px, 5px) scale(1)"
                },
                "&.MuiInputLabel-standard": {
                  "transform": "translate(0, 9px) scale(1)"
                }
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "&.MuiInputLabel-outlined, &.MuiInputLabel-filled": {
                  "transform": "translate(14px, 10px) scale(1)"
                },
                "&.MuiInputLabel-standard": {
                  "transform": "translate(0, 14px) scale(1)"
                }
              }
            }
          ]
        }
      }
    },
    "MuiOutlinedInput": {
      "styleOverrides": {
        "input": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": "24px"
        },
        "root": {
          "&.MuiInputBase-sizeLarge": {
            "& .MuiOutlinedInput-input": {
              "fontSize": "0.9375rem",
              "fontWeight": 400,
              "lineHeight": "24px",
              "paddingBlock": "10px",
              "height": "auto"
            },
            "minHeight": "42px"
          },
          "&.MuiInputBase-sizeSmall": {
            "minHeight": "30px",
            "& .MuiOutlinedInput-input": {
              "paddingBlock": "5px",
              "height": "auto"
            }
          },
          "&.MuiInputBase-sizeMedium": {
            "minHeight": "36px",
            "& .MuiOutlinedInput-input": {
              "paddingBlock": "7px",
              "height": "auto"
            }
          },
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            "borderColor": "#ffffff1f",
            "backgroundColor": "#ffffff0f"
          },
          "variants": [
            {
              "props": {
                "size": "small"
              },
              "style": {
                "minHeight": "30px",
                "& .MuiOutlinedInput-input": {
                  "paddingBlock": "5px",
                  "height": "auto"
                }
              }
            },
            {
              "props": {
                "size": "medium"
              },
              "style": {
                "minHeight": "36px",
                "& .MuiOutlinedInput-input": {
                  "paddingBlock": "7px",
                  "height": "auto"
                }
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "minHeight": "42px",
                "& .MuiOutlinedInput-input": {
                  "paddingBlock": "10px",
                  "height": "auto"
                }
              }
            }
          ]
        },
        "notchedOutline": {
          "& legend": {
            "fontSize": "12px"
          }
        }
      }
    },
    "MuiFilledInput": {
      "styleOverrides": {
        "input": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": "24px"
        },
        "root": {
          "&.MuiInputBase-sizeLarge": {
            "& .MuiFilledInput-input": {
              "fontSize": "0.9375rem",
              "fontWeight": 400,
              "lineHeight": "24px"
            }
          },
          "variants": [
            {
              "props": {
                "size": "small"
              },
              "style": {
                "minHeight": "30px",
                "& .MuiFilledInput-input": {
                  "paddingBlock": "5px",
                  "height": "auto"
                }
              }
            },
            {
              "props": {
                "size": "medium"
              },
              "style": {
                "minHeight": "36px",
                "& .MuiFilledInput-input": {
                  "paddingBlock": "7px",
                  "height": "auto"
                }
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "minHeight": "42px",
                "& .MuiFilledInput-input": {
                  "paddingBlock": "10px",
                  "height": "auto"
                }
              }
            }
          ]
        }
      }
    },
    "MuiInput": {
      "styleOverrides": {
        "input": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": "24px"
        },
        "root": {
          "&.MuiInputBase-sizeLarge": {
            "& .MuiInput-input": {
              "fontSize": "0.9375rem",
              "fontWeight": 400,
              "lineHeight": "24px"
            }
          },
          "variants": [
            {
              "props": {
                "size": "small"
              },
              "style": {
                "minHeight": "30px",
                "& .MuiInput-input": {
                  "paddingBlock": "5px",
                  "height": "auto"
                }
              }
            },
            {
              "props": {
                "size": "medium"
              },
              "style": {
                "minHeight": "36px",
                "& .MuiInput-input": {
                  "paddingBlock": "7px",
                  "height": "auto"
                }
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "minHeight": "42px",
                "& .MuiInput-input": {
                  "paddingBlock": "10px",
                  "height": "auto"
                }
              }
            }
          ]
        }
      }
    },
    "MuiSelect": {
      "styleOverrides": {
        "select": {
          "fontSize": "0.8125rem",
          "fontWeight": 400,
          "lineHeight": "24px",
          "variants": [
            {
              "props": {
                "size": "small"
              },
              "style": {
                "minHeight": "30px",
                "paddingBlock": "5px"
              }
            },
            {
              "props": {
                "size": "medium"
              },
              "style": {
                "minHeight": "36px",
                "paddingBlock": "7px"
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "minHeight": "42px",
                "paddingBlock": "10px"
              }
            }
          ]
        },
        "root": {
          "&.MuiInputBase-sizeLarge": {
            "& .MuiSelect-select": {
              "fontSize": "0.9375rem",
              "fontWeight": 400,
              "lineHeight": "24px"
            }
          }
        },
        "icon": {
          "variants": [
            {
              "props": {
                "size": "small"
              },
              "style": {
                "fontSize": "1.25rem"
              }
            },
            {
              "props": {
                "size": "medium"
              },
              "style": {
                "fontSize": "1.5rem"
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "fontSize": "1.75rem"
              }
            }
          ]
        }
      }
    },
    "MuiButton": {
      "variants": [
        {
          "props": {
            "size": "large"
          },
          "style": {
            "fontSize": "0.9375rem",
            "fontWeight": 500,
            "lineHeight": "26px",
            "textTransform": "uppercase",
            "minHeight": "42px"
          }
        },
        {
          "props": {
            "size": "medium"
          },
          "style": {
            "fontSize": "0.8125rem",
            "fontWeight": 500,
            "lineHeight": "24px",
            "textTransform": "uppercase",
            "minHeight": "36px"
          }
        },
        {
          "props": {
            "size": "small"
          },
          "style": {
            "fontSize": "0.8125rem",
            "fontWeight": 500,
            "lineHeight": "20px",
            "textTransform": "uppercase",
            "minHeight": "30px"
          }
        },
        {
          "props": {
            "size": "xsmall"
          },
          "style": {
            "fontSize": "0.75rem",
            "lineHeight": "20px",
            "minWidth": 0,
            "minHeight": "24px"
          }
        },
        {
          "props": {
            "size": "xsmall",
            "variant": "text"
          },
          "style": {
            "padding": "2px 4px"
          }
        },
        {
          "props": {
            "size": "xsmall",
            "variant": "contained"
          },
          "style": {
            "padding": "2px 6px"
          }
        },
        {
          "props": {
            "size": "xsmall",
            "variant": "outlined"
          },
          "style": {
            "padding": "1px 5px"
          }
        }
      ],
      "styleOverrides": {
        "root": {
          "boxShadow": "none",
          "&:hover": {
            "boxShadow": "none"
          },
          "&:active": {
            "boxShadow": "none"
          },
          "&.Mui-focusVisible": {
            "boxShadow": "none"
          }
        }
      }
    },
    "MuiToggleButton": {
      "styleOverrides": {
        "sizeLarge": {
          "fontSize": "0.9375rem",
          "fontWeight": 500,
          "lineHeight": "26px",
          "textTransform": "none",
          "minHeight": "42px",
          "height": "42px",
          "padding": "8px 14px"
        },
        "sizeMedium": {
          "fontSize": "0.8125rem",
          "fontWeight": 500,
          "lineHeight": "24px",
          "textTransform": "none",
          "minHeight": "36px",
          "height": "36px",
          "padding": "6px 12px"
        },
        "sizeSmall": {
          "fontSize": "0.8125rem",
          "fontWeight": 500,
          "lineHeight": "20px",
          "textTransform": "none",
          "minHeight": "30px",
          "height": "30px",
          "padding": "4px 12px"
        },
        "root": {
          "textTransform": "none",
          "whiteSpace": "nowrap"
        }
      }
    },
    "MuiIconButton": {
      "styleOverrides": {
        "root": {
          "variants": [
            {
              "props": {
                "size": "xsmall"
              },
              "style": {
                "width": "24px",
                "height": "24px",
                "fontSize": "1rem"
              }
            },
            {
              "props": {
                "size": "small"
              },
              "style": {
                "width": "30px",
                "height": "30px"
              }
            },
            {
              "props": {
                "size": "medium"
              },
              "style": {
                "width": "36px",
                "height": "36px"
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "width": "42px",
                "height": "42px"
              }
            }
          ]
        }
      }
    },
    "MuiTextField": {
      "styleOverrides": {
        "root": {
          "verticalAlign": "top",
          "& .MuiFormHelperText-root": {
            "marginTop": "2px",
            "marginLeft": 0,
            "marginRight": 0,
            "lineHeight": 1.2
          },
          "variants": [
            {
              "props": {
                "size": "small"
              },
              "style": {
                "& .MuiInputBase-root": {
                  "minHeight": "30px"
                }
              }
            },
            {
              "props": {
                "size": "medium"
              },
              "style": {
                "& .MuiInputBase-root": {
                  "minHeight": "36px"
                }
              }
            },
            {
              "props": {
                "size": "large"
              },
              "style": {
                "& .MuiInputBase-root": {
                  "minHeight": "42px"
                }
              }
            }
          ]
        }
      }
    },
    "MuiButtonGroup": {
      "styleOverrides": {
        "root": {
          "alignItems": "stretch"
        }
      }
    },
    "MuiToggleButtonGroup": {
      "styleOverrides": {
        "root": {
          "alignItems": "stretch",
          "& .MuiToggleButtonGroup-grouped.MuiToggleButton-sizeSmall": {
            "minHeight": "30px",
            "height": "30px"
          },
          "& .MuiToggleButtonGroup-grouped.MuiToggleButton-sizeMedium": {
            "minHeight": "36px",
            "height": "36px"
          },
          "& .MuiToggleButtonGroup-grouped.MuiToggleButton-sizeLarge": {
            "minHeight": "42px",
            "height": "42px"
          }
        },
        "grouped": {
          "minHeight": "inherit"
        }
      }
    },
    "MuiTableCell": {
      "styleOverrides": {
        "head": {
          "backgroundColor": "#ffffff14"
        }
      }
    },
    "MuiDialogTitle": {
      "styleOverrides": {
        "root": {
          "fontSize": "18px"
        }
      }
    },
    "MuiDialogContent": {
      "styleOverrides": {
        "root": {
          "padding": "24px"
        }
      }
    },
    "MuiDialogActions": {
      "styleOverrides": {
        "root": {
          "padding": "12px 24px"
        }
      }
    }
  },
  "brand": {
    "colors": {
      "hecto": {
        "orange": {
          "50": "#fceae7",
          "100": "#ffcebb",
          "200": "#ffaf8f",
          "300": "#ff9061",
          "400": "#ff783c",
          "500": "#ff6114",
          "600": "#f45c0f",
          "700": "#e65509",
          "800": "#d84e05",
          "900": "#c04000"
        },
        "grey": {
          "50": "#f5f5f5",
          "100": "#e9e9e9",
          "200": "#d9d9d9",
          "300": "#c4c4c4",
          "400": "#9d9d9d",
          "500": "#7b7b7b",
          "600": "#555555",
          "700": "#434343",
          "800": "#262626",
          "900": "#121212"
        },
        "blue": {
          "50": "#e2f1ff",
          "100": "#badcff",
          "200": "#8dc8ff",
          "300": "#5cb2ff",
          "400": "#36a1ff",
          "500": "#0291fe",
          "600": "#0e83ef",
          "700": "#1270dc",
          "800": "#145fc9",
          "900": "#1440aa"
        },
        "lime": {
          "50": "#f9ffe8",
          "100": "#f0fec4",
          "200": "#e4fe9a",
          "300": "#e1ff71",
          "400": "#d9ff4b",
          "500": "#cfff1e",
          "600": "#c3eb11",
          "700": "#b3d400",
          "800": "#a5bc00",
          "900": "#8e9300"
        },
        "indigo": {
          "50": "#e7e9f8",
          "100": "#c3c8ed",
          "200": "#9aa4e0",
          "300": "#7181d4",
          "400": "#5065cb",
          "500": "#2a49c1",
          "600": "#2441b7",
          "700": "#1837ab",
          "800": "#082d9f",
          "900": "#00198c"
        },
        "green": {
          "50": "#e0f6ee",
          "100": "#b2e9d4",
          "200": "#7cdab9",
          "300": "#25cc9c",
          "400": "#00c087",
          "500": "#00b473",
          "600": "#00a567",
          "700": "#009259",
          "800": "#00814c",
          "900": "#006135"
        },
        "deepgreen": {
          "50": "#dff1f1",
          "100": "#b0dbda",
          "200": "#7dc5c3",
          "300": "#4aaeaa",
          "400": "#249d97",
          "500": "#028c85",
          "600": "#027f78",
          "700": "#037068",
          "800": "#056059",
          "900": "#06443c"
        }
      }
    },
    "sizes": {
      "logo": {
        "small": 20,
        "medium": 24,
        "large": 28,
        "extraLarge": 50
      }
    }
  },
  "palette": {
    "mode": "dark",
    "primary": {
      "light": "#d1c4e9",
      "main": "#7c4dff",
      "dark": "#512da8",
      "contrastText": "#ffffff",
      "_states": {
        "hover": "#a288ff14",
        "selected": "#a288ff29",
        "focusVisible": "#a288ff4d",
        "outlinedBorder": "#a288ff80",
        "focus": "#a288ff1f"
      }
    },
    "secondary": {
      "light": "#ffffff",
      "main": "#f5f5f5",
      "dark": "#bdbdbd",
      "contrastText": "#212121",
      "_states": {
        "hover": "#ffffff14",
        "selected": "#ffffff29",
        "focusVisible": "#ffffff4d",
        "outlinedBorder": "#ffffff80",
        "focus": "#ffffff1f"
      }
    },
    "error": {
      "light": "#ff8a80",
      "main": "#ff5252",
      "dark": "#e53935",
      "contrastText": "#ffffff",
      "_states": {
        "hover": "#ff525214",
        "selected": "#ff525229",
        "focusVisible": "#ff52524d",
        "outlinedBorder": "#ff525280"
      }
    },
    "warning": {
      "light": "#ffaf8f",
      "main": "#ff6114",
      "dark": "#d84e05",
      "contrastText": "#ffffff",
      "_states": {
        "hover": "#ff906114",
        "selected": "#ff906129",
        "focusVisible": "#ff90614d",
        "outlinedBorder": "#ff906180"
      }
    },
    "info": {
      "light": "#8dc8ff",
      "main": "#36a1ff",
      "dark": "#1270dc",
      "contrastText": "#ffffff",
      "_states": {
        "hover": "#36a1ff14",
        "selected": "#36a1ff29",
        "focusVisible": "#36a1ff4d",
        "outlinedBorder": "#36a1ff80"
      }
    },
    "success": {
      "light": "#7cdab9",
      "main": "#00b473",
      "dark": "#009259",
      "contrastText": "#ffffff",
      "_states": {
        "hover": "#00c08714",
        "selected": "#00c08729",
        "focusVisible": "#00c0874d",
        "outlinedBorder": "#00c08780"
      }
    },
    "text": {
      "primary": "#ffffff",
      "secondary": "#ffffff99",
      "disabled": "#ffffff66"
    },
    "background": {
      "default": "#212121",
      "paper": "#212121"
    },
    "action": {
      "active": "#ffffff99",
      "hover": "#ffffff14",
      "selected": "#ffffff29",
      "disabled": "#ffffff66",
      "disabledBackground": "#ffffff0f",
      "focus": "#ffffff1f"
    },
    "common": {
      "white": "#ffffff",
      "black": "#000000"
    },
    "divider": "#ffffff1f",
    "_components": {
      "appBar": {
        "defaultFill": "#272727",
        "darkFill": "#323232"
      }
    },
    "hecto": {
      "orange": {
        "50": "#fceae7",
        "100": "#ffcebb",
        "200": "#ffaf8f",
        "300": "#ff9061",
        "400": "#ff783c",
        "500": "#ff6114",
        "600": "#f45c0f",
        "700": "#e65509",
        "800": "#d84e05",
        "900": "#c04000"
      },
      "grey": {
        "50": "#f5f5f5",
        "100": "#e9e9e9",
        "200": "#d9d9d9",
        "300": "#c4c4c4",
        "400": "#9d9d9d",
        "500": "#7b7b7b",
        "600": "#555555",
        "700": "#434343",
        "800": "#262626",
        "900": "#121212"
      },
      "blue": {
        "50": "#e2f1ff",
        "100": "#badcff",
        "200": "#8dc8ff",
        "300": "#5cb2ff",
        "400": "#36a1ff",
        "500": "#0291fe",
        "600": "#0e83ef",
        "700": "#1270dc",
        "800": "#145fc9",
        "900": "#1440aa"
      },
      "lime": {
        "50": "#f9ffe8",
        "100": "#f0fec4",
        "200": "#e4fe9a",
        "300": "#e1ff71",
        "400": "#d9ff4b",
        "500": "#cfff1e",
        "600": "#c3eb11",
        "700": "#b3d400",
        "800": "#a5bc00",
        "900": "#8e9300"
      },
      "indigo": {
        "50": "#e7e9f8",
        "100": "#c3c8ed",
        "200": "#9aa4e0",
        "300": "#7181d4",
        "400": "#5065cb",
        "500": "#2a49c1",
        "600": "#2441b7",
        "700": "#1837ab",
        "800": "#082d9f",
        "900": "#00198c"
      },
      "green": {
        "50": "#e0f6ee",
        "100": "#b2e9d4",
        "200": "#7cdab9",
        "300": "#25cc9c",
        "400": "#00c087",
        "500": "#00b473",
        "600": "#00a567",
        "700": "#009259",
        "800": "#00814c",
        "900": "#006135"
      },
      "deepgreen": {
        "50": "#dff1f1",
        "100": "#b0dbda",
        "200": "#7dc5c3",
        "300": "#4aaeaa",
        "400": "#249d97",
        "500": "#028c85",
        "600": "#027f78",
        "700": "#037068",
        "800": "#056059",
        "900": "#06443c"
      }
    }
  }
} as ThemeOptions;

export function createLightTheme(): Theme {
  return createTheme(lightThemeOptions);
}

export function createDarkTheme(): Theme {
  return createTheme(darkThemeOptions);
}

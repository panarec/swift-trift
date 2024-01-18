import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin'

export const myCustomTheme: CustomThemeConfig = {
    name: 'my-custom-theme',
    properties: {
        // =~= Theme Properties =~=
        '--theme-font-family-base': `system-ui`,
        '--theme-font-family-heading': `system-ui`,
        '--theme-font-color-base': '0 0 0',
        '--theme-font-color-dark': '255 255 255',
        '--theme-rounded-base': '9999px',
        '--theme-rounded-container': '8px',
        '--theme-border-base': '1px',
        // =~= Theme On-X Colors =~=
        '--on-primary': '0 0 0',
        '--on-secondary': '0 0 0',
        '--on-tertiary': '255 255 255',
        '--on-success': '0 0 0',
        '--on-warning': '0 0 0',
        '--on-error': '255 255 255',
        '--on-surface': '0 0 0',
        // =~= Theme Colors  =~=
        // primary | #ffb703
        '--color-primary-50': '255 244 217', // #fff4d9
        '--color-primary-100': '255 241 205', // #fff1cd
        '--color-primary-200': '255 237 192', // #ffedc0
        '--color-primary-300': '255 226 154', // #ffe29a
        '--color-primary-400': '255 205 79', // #ffcd4f
        '--color-primary-500': '255 183 3', // #ffb703
        '--color-primary-600': '230 165 3', // #e6a503
        '--color-primary-700': '191 137 2', // #bf8902
        '--color-primary-800': '153 110 2', // #996e02
        '--color-primary-900': '125 90 1', // #7d5a01
        // secondary | #219ebc
        '--color-secondary-50': '222 240 245', // #def0f5
        '--color-secondary-100': '211 236 242', // #d3ecf2
        '--color-secondary-200': '200 231 238', // #c8e7ee
        '--color-secondary-300': '166 216 228', // #a6d8e4
        '--color-secondary-400': '100 187 208', // #64bbd0
        '--color-secondary-500': '33 158 188', // #219ebc
        '--color-secondary-600': '30 142 169', // #1e8ea9
        '--color-secondary-700': '25 119 141', // #19778d
        '--color-secondary-800': '20 95 113', // #145f71
        '--color-secondary-900': '16 77 92', // #104d5c
        // tertiary | #126782
        '--color-tertiary-50': '219 232 236', // #dbe8ec
        '--color-tertiary-100': '208 225 230', // #d0e1e6
        '--color-tertiary-200': '196 217 224', // #c4d9e0
        '--color-tertiary-300': '160 194 205', // #a0c2cd
        '--color-tertiary-400': '89 149 168', // #5995a8
        '--color-tertiary-500': '18 103 130', // #126782
        '--color-tertiary-600': '16 93 117', // #105d75
        '--color-tertiary-700': '14 77 98', // #0e4d62
        '--color-tertiary-800': '11 62 78', // #0b3e4e
        '--color-tertiary-900': '9 50 64', // #093240
        // success | #fb8500
        '--color-success-50': '254 237 217', // #feedd9
        '--color-success-100': '254 231 204', // #fee7cc
        '--color-success-200': '254 225 191', // #fee1bf
        '--color-success-300': '253 206 153', // #fdce99
        '--color-success-400': '252 170 77', // #fcaa4d
        '--color-success-500': '251 133 0', // #fb8500
        '--color-success-600': '226 120 0', // #e27800
        '--color-success-700': '188 100 0', // #bc6400
        '--color-success-800': '151 80 0', // #975000
        '--color-success-900': '123 65 0', // #7b4100
        // warning | #8ecae6
        '--color-warning-50': '238 247 251', // #eef7fb
        '--color-warning-100': '232 244 250', // #e8f4fa
        '--color-warning-200': '227 242 249', // #e3f2f9
        '--color-warning-300': '210 234 245', // #d2eaf5
        '--color-warning-400': '176 218 238', // #b0daee
        '--color-warning-500': '142 202 230', // #8ecae6
        '--color-warning-600': '128 182 207', // #80b6cf
        '--color-warning-700': '107 152 173', // #6b98ad
        '--color-warning-800': '85 121 138', // #55798a
        '--color-warning-900': '70 99 113', // #466371
        // error | #023047
        '--color-error-50': '217 224 227', // #d9e0e3
        '--color-error-100': '204 214 218', // #ccd6da
        '--color-error-200': '192 203 209', // #c0cbd1
        '--color-error-300': '154 172 181', // #9aacb5
        '--color-error-400': '78 110 126', // #4e6e7e
        '--color-error-500': '2 48 71', // #023047
        '--color-error-600': '2 43 64', // #022b40
        '--color-error-700': '2 36 53', // #022435
        '--color-error-800': '1 29 43', // #011d2b
        '--color-error-900': '1 24 35', // #011823
        // surface | #c7c7c7
        '--color-surface-50': '247 247 247', // #f7f7f7
        '--color-surface-100': '244 244 244', // #f4f4f4
        '--color-surface-200': '241 241 241', // #f1f1f1
        '--color-surface-300': '233 233 233', // #e9e9e9
        '--color-surface-400': '216 216 216', // #d8d8d8
        '--color-surface-500': '199 199 199', // #c7c7c7
        '--color-surface-600': '179 179 179', // #b3b3b3
        '--color-surface-700': '149 149 149', // #959595
        '--color-surface-800': '119 119 119', // #777777
        '--color-surface-900': '98 98 98', // #626262
    },
}

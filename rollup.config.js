import * as path from 'path'
import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import { version } from './package.json'

const builds = {
    'cjs': {
        outFile: 'index.js',
        format: 'cjs',
        mode: 'production'
    },
    'umd': {
        outFile: 'index.js',
        format: 'umd',
        mode: 'production'
    }
}

function onwarn(msg, warn) {
    if (!/Circular/.test(msg)) {
        warn(msg)
    }
}

function getAllBuilds() {
    return Object.keys(builds).map((key) => genConfig(builds[key]))
}

function genConfig({ outFile, format, mode }) {
    const isProd = mode === 'production'
    return {
        input: './src/index.ts',
        output: {
            file: path.join('./dist', outFile),
            format,
            exports: 'named',
            name: format === 'umd' ? 'index' : undefined
        },
        onwarn,
        plugins: [
            nodePolyfills(),
            commonjs(),
            typescript({
                tsconfigOverride: {
                    declaration: false,
                    declarationDir: null,
                    emitDeclarationOnly: false
                },
                useTsconfigDeclarationDir: true
            }),
            resolve(),
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV':
          format === 'es'
              ? // preserve to be handled by bundlers
              'process.env.NODE_ENV'
              : // hard coded dev/prod builds
              JSON.stringify(isProd ? 'production' : 'development'),
                __DEV__:
          format === 'es'
              ? // preserve to be handled by bundlers
              '(process.env.NODE_ENV !== \'production\')'
              : // hard coded dev/prod builds
              !isProd,
                __VERSION__: JSON.stringify(version)
            }),
            isProd && terser()
        ].filter(Boolean)
    }
}

let buildConfig

if (process.env.TARGET) {
    buildConfig = [genConfig(builds[process.env.TARGET])]
} else {
    buildConfig = getAllBuilds()
}

// bundle typings
buildConfig.push({
    input: 'typings/index.d.ts',
    output: {
        file: 'dist/index.d.ts',
        format: 'es'
    },
    onwarn,
    plugins: [dts()]
})

export default buildConfig

import sass from 'node-sass';
import { createFilter } from 'rollup-pluginutils';

export default function plugin (opts={}) {
    let cfg = {
        // defaults
        include: [ '**/*.scss' ],
        exclude: [ 'node_modules/**' ],
        options: {},

        // outside options (overrides)
        ...opts
    };

    const filter = createFilter(cfg.include, cfg.exclude);

    return {
        name: 'scss',
        transform: function transform (fileData, fileName) {
            if (!filter(fileName)) {
                return null;
            }

            try {
                let rendered = sass.renderSync({
                    ...cfg.options,
                    data: fileData,
                    file: fileName,
                });

                return `export default ${JSON.stringify(rendered.css.toString())};`;
            } catch (err) {
                throw new Error(err.formatted);
            }
        }
    };
};

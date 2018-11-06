import less from 'less';
import { createFilter } from 'rollup-pluginutils';

function renderSync (code, options) {
    return less
        .render(code, options)
        .then(function (output) {
            return output;
        }, function (err) {
            throw err;
        });
}//renderSync

export default function plugin (options={}) {
    let _defaults = {
        include: [ '**/*.less', '**/*.css' ],
        exclude: [ 'node_modules/**' ],
        options: {}
    };
    let cfg = Object.assign({}, _defaults, options);

    const filter = createFilter(cfg.include, cfg.exclude);

    return {
        name: 'less',
        transform: async function transform (code, fileName) {
            if (!filter(fileName)) {
                return null;
            }

            cfg.options.filename = fileName;

            try {
                let rendered = await renderSync(code, cfg.options);

                return {
                    code: `export default ${JSON.stringify(rendered.css)};`,
                    map: {
                        mappings: rendered.map
                    }
                };
            } catch (error) {
                throw error;
            }
        }
    };
};

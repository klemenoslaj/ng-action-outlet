const dirname = require('path').dirname;
const shell = require('shelljs');

async function prepare({ packages }, context) {
    const PLACEHOLDER_VERSION = '0.0.0-development';
    const { nextRelease: { version }, logger } = context;

    shell.exec(`npm version ${version} --no-git-tag-version`, { cwd: dirname(file) });

    shell
        .ls(`${packages}/*/package.json`)
        .forEach(file => {
            shell.sed('-i', PLACEHOLDER_VERSION, version, file);
            logger.log(`Write version ${version} to package.json in ${file}`);
        });
}

async function publish({ packages }, context) {
    const { logger } = context;

    shell
        .ls(`${packages}/*/package.json`)
        .map(file => ({ pkgPath: dirname(file), package: JSON.parse(shell.cat(file)) }))
        .forEach(({ pkgPath: packagePath, package }) => {
            shell.exec(`npm publish ${packagePath} --access public`, { cwd: packagePath });
            logger.log(`Published ${package.name}@${package.version}.`);
        });
}

module.exports = { prepare, publish };

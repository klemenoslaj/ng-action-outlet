const dirname = require('path').dirname;
const shell = require('shelljs');

async function prepare({ packages }, context) {
    const PLACEHOLDER_VERSION = '0.0.0-development';
    const { nextRelease: { version }, logger, env } = context;

    shell
        .ls(`${packages}/*/package.json`)
        .forEach(file => {
            shell.exec(`npm version ${version} --no-git-tag-version`, { cwd: dirname(file), env });
            shell.sed('-i', PLACEHOLDER_VERSION, version, file);
            logger.log(`Write version ${version} to package.json in ${file}`);
        });
}

async function publish({ packages }, context) {
    const { logger, env } = context;

    if (!env.NPM_TOKEN) {
        throw new Error('NPM_TOKEN environment');
    }

    shell.ShellString(`//registry.npmjs.org/:_authToken=${env.NPM_TOKEN}`).to('~/.npmrc');

    shell
        .ls(`${packages}/*/package.json`)
        .map(file => ({ pkgPath: dirname(file), package: JSON.parse(shell.cat(file)) }))
        .forEach(({ pkgPath: cwd, package }) => {
            const config = `${cwd}/.npmrc`;

            shell.ShellString(`//registry.npmjs.org/:_authToken=${env.NPM_TOKEN}`).to(config);
            logger.log(`Wrote NPM_TOKEN to ${config}`);


            if (shell.exec(`npm publish --access public`, { cwd, env }).code === 0) {
                logger.log(`Published ${package.name}@${package.version}.`);
            } else {
                throw new Error(`The release of ${package.name} failed.`);
            }
        });
}

module.exports = { prepare, publish };

import {
  checkFilesExist,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { ensureNxProjectWithDeps } from '../../utils/testing';

describe('outputtargets e2e', () => {
  beforeAll(() => {
    ensureNxProjectWithDeps('@nxext/stencil', 'dist/packages/stencil', [
      ['@nxext/vite', 'dist/packages/vite'],
      ['@nxext/svelte', 'dist/packages/svelte'],
    ]);
  });

  it(`should generate react lib`, async () => {
    const plugin = uniq('lib');
    await runNxCommandAsync(
      `generate @nxext/stencil:lib ${plugin} --style='css' --buildable --e2eTestRunner='none' --junitTestRunner='none'`
    );
    await runNxCommandAsync(
      `generate @nxext/stencil:add-outputtarget ${plugin} --outputType=react`
    );
    await runNxCommandAsync(`build ${plugin}`);

    expect(() =>
      checkFilesExist(`libs/${plugin}-react/src/index.ts`)
    ).not.toThrow();
  });

  it(`should generate angular lib`, async () => {
    const plugin = uniq('lib');
    await runNxCommandAsync(
      `generate @nxext/stencil:lib ${plugin} --style='css' --buildable --e2eTestRunner='none' --junitTestRunner='none'`
    );
    await runNxCommandAsync(
      `generate @nxext/stencil:add-outputtarget ${plugin} --outputType=angular`
    );
    await runNxCommandAsync(`build ${plugin}`);

    expect(() =>
      checkFilesExist(
        `libs/${plugin}-angular/src/index.ts`,
        `libs/${plugin}-angular/src/lib/${plugin}-angular.module.ts`
      )
    ).not.toThrow();
  });

  it(`should generate svelte lib`, async () => {
    const plugin = uniq('lib');
    await runNxCommandAsync(
      `generate @nxext/stencil:lib ${plugin} --style='css' --buildable --e2eTestRunner='none' --junitTestRunner='none'`
    );
    await runNxCommandAsync(
      `generate @nxext/stencil:add-outputtarget ${plugin} --outputType=svelte`
    );

    expect(() =>
      checkFilesExist(`libs/${plugin}-svelte/src/index.ts`)
    ).not.toThrow();
  });

  it(`should stop if lib not buildable`, async () => {
    const plugin = uniq('lib');
    await runNxCommandAsync(
      `generate @nxext/stencil:lib ${plugin} --style='css' --e2eTestRunner='none' --junitTestRunner='none'`
    );
    const result = await runNxCommandAsync(
      `generate @nxext/stencil:add-outputtarget ${plugin} --outputType=angular`
    );

    expect(result.stdout).toContain(
      'Please use a buildable library for custom outputtargets'
    );
  });
});
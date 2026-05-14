import os from 'os';

jest.mock('os');
const mockOs = os as jest.Mocked<typeof os>;

import { execSync } from 'child_process';
jest.mock('child_process');
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

import { hideFolder } from '../../../infrastructure/filesystem/hidden.service';

describe('hideFolder()', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('ejecuta attrib +h en Windows', () => {
    mockOs.platform.mockReturnValueOnce('win32');
    hideFolder('C:\\Users\\test\\.pwvault');
    expect(mockExecSync).toHaveBeenCalledWith(
      'attrib +h "C:\\Users\\test\\.pwvault"',
    );
  });

  it('no hace nada en Linux', () => {
    mockOs.platform.mockReturnValueOnce('linux');
    hideFolder('/home/test/.pwvault');
    expect(mockExecSync).not.toHaveBeenCalled();
  });

  it('no hace nada en macOS', () => {
    mockOs.platform.mockReturnValueOnce('darwin');
    hideFolder('/Users/test/.pwvault');
    expect(mockExecSync).not.toHaveBeenCalled();
  });

  it('no lanza error si attrib falla', () => {
    mockOs.platform.mockReturnValueOnce('win32');
    mockExecSync.mockImplementationOnce(() => {
      throw new Error('command not found');
    });
    expect(() => hideFolder('C:\\test')).not.toThrow();
  });
});

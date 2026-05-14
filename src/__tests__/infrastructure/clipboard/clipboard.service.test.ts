import os from 'os';
jest.mock('os');
const mockOs = os as jest.Mocked<typeof os>;

import { execSync } from 'child_process';
jest.mock('child_process');
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

import { copyToClipboard } from '../../../infrastructure/clipboard/clipboard.service';

describe('copyToClipboard()', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('usa clip en Windows', () => {
    mockOs.platform.mockReturnValueOnce('win32');
    copyToClipboard('miPass123');
    expect(mockExecSync).toHaveBeenCalledWith('echo miPass123 | clip');
  });

  it('usa pbcopy en macOS', () => {
    mockOs.platform.mockReturnValueOnce('darwin');
    copyToClipboard('miPass123');
    expect(mockExecSync).toHaveBeenCalledWith('echo miPass123 | pbcopy');
  });

  it('usa xclip en Linux', () => {
    mockOs.platform.mockReturnValueOnce('linux');
    copyToClipboard('miPass123');
    expect(mockExecSync).toHaveBeenCalledWith('echo miPass123 | xclip -selection clipboard');
  });

  it('limpia espacios al inicio y final', () => {
    mockOs.platform.mockReturnValueOnce('win32');
    copyToClipboard('  pass  ');
    expect(mockExecSync).toHaveBeenCalledWith('echo pass | clip');
  });
});

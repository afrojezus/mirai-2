/* Detects if Electron is being used to drive the client
  * @note: I haven't tested this fully, you should try if it works 100%, though
  * I'm pretty confident it will
  - amery */
export default function isElectron()
{
  /* This is for the renderer process */
  if (
    typeof window !== 'undefined' &&
    typeof window.process === 'object' &&
    window.process.type === 'renderer'
  )
  {
    return true;
  }

  /* This is for the main process */
  if (
    typeof process !== 'undefined' &&
    typeof process.versions === 'object' &&
    !!process.versions.electron
  )
  {
    return true;
  }

  /* Detect user agent with nodeIntegration = true */
  if (
    typeof navigator === 'object' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.indexOf('Electron') >= 0
  )
  {
    return true;
  }

  return false;
}

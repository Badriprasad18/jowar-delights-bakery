import fs from 'fs';
import path from 'path';

async function main() {
  const serverPath = path.resolve('dist/server/index.js');
  if (!fs.existsSync(serverPath)) {
    console.log('Skipping index.html generation: No server build found.');
    return;
  }
  
  const worker = await import(serverPath);
  const fetchFn = worker.default?.fetch || worker.fetch;
  if (!fetchFn) {
    console.log('Skipping index.html generation: No fetch function found in server build.');
    return;
  }

  try {
    const request = new Request('http://localhost/');
    const response = await fetchFn(request, {}, {});
    const html = await response.text();
    fs.writeFileSync('dist/client/index.html', html);
    console.log('Generated dist/client/index.html successfully for Netlify SPA deployment.');
  } catch (error) {
    console.error('Failed to generate index.html:', error);
  }
}

main().catch(console.error);

import { CommonEngine } from '@angular/ssr/node';
import { render } from '@netlify/angular-runtime/common-engine.js';

const commonEngine = new CommonEngine();

export async function netlifyCommonEngineHandler(
  _request: Request,
  _context: unknown,
): Promise<Response> {
  return render(commonEngine);
}

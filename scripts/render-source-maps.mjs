// Reproducible PDF rendering and code-native composition, not AI geography.
// Usage: node scripts/render-source-maps.mjs /absolute/path/application.pdf
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,renameSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require(process.env.SL4_SHARP_PATH || '/Users/gwinja/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const pdf=process.argv[2];
if(!pdf)throw new Error('Provide the unchanged county application PDF.');
const sourceSHA256=createHash('sha256').update(readFileSync(pdf)).digest('hex');
if(sourceSHA256!=='2136312ca1da8cd68457b9446a480daad216f8dd5cbb87b26e36a189ff0a6c05')throw new Error('Source PDF differs from the visually verified 56-page county application. Reverify pages and crop before changing this fingerprint.');
const root=resolve(import.meta.dirname,'..');
const out=resolve(root,'public/maps');mkdirSync(out,{recursive:true});
// Remove page margins only. Retain complete figure, legend, scale, attribution.
execFileSync('pdftoppm',['-f','15','-l','16','-r','200','-x','225','-y','230','-W','1280','-H','1720','-jpeg','-jpegopt','quality=94',pdf,resolve(out,'page')]);
renameSync(resolve(out,'page-15.jpg'),resolve(out,'application-figure-2.jpg'));
renameSync(resolve(out,'page-16.jpg'),resolve(out,'application-figure-3.jpg'));
const data=n=>`data:image/jpeg;base64,${readFileSync(resolve(out,`application-figure-${n}.jpg`)).toString('base64')}`;
// Shared images show only the map panel, with a concise key and citation.
const panel=(n,x,y,w,h)=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="25 24 1220 1331" preserveAspectRatio="xMidYMid meet"><image width="1280" height="1720" href="${data(n)}"/></svg>`;
const preview=`<svg xmlns="http://www.w3.org/2000/svg" width="460" height="460" viewBox="0 0 460 460" role="img" aria-labelledby="title desc"><title id="title">Site Layer 4 application map near Wheatland</title><desc id="desc">Regional map from application Figure 3. Red outline: applicant's project area southeast of Wheatland. Black dashes: 13-mile context buffer, not the project boundary. Full legend on detail page.</desc><rect width="460" height="460" fill="#f0f3ee"/>${panel(3,20,15,420,377)}<rect y="396" width="460" height="64" fill="#10233b"/><text x="18" y="421" fill="white" font-family="Arial,sans-serif" font-size="17" font-weight="700">Red outline: application project area</text><text x="18" y="443" fill="#e0e9f3" font-family="Arial,sans-serif" font-size="12">SWCA · Figure 3 / PDF p. 16 · Dashes: context buffer</text></svg>`;
writeFileSync(resolve(root,'public/location-preview.svg'),preview);
const social=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#10233b"/><rect x="48" y="49" width="64" height="64" rx="12" fill="#fff"/><text x="59" y="91" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#10233b">SR</text><text x="48" y="194" font-family="Arial,sans-serif" font-size="53" font-weight="700" fill="white">Site Layer 4</text><text x="48" y="254" font-family="Arial,sans-serif" font-size="53" font-weight="700" fill="white">Project Record</text><rect x="48" y="290" width="92" height="5" fill="#83b9ce"/><text x="48" y="345" font-family="Arial,sans-serif" font-size="26" fill="#e0e9f3">Public records. Local questions.</text><text x="48" y="384" font-family="Arial,sans-serif" font-size="26" fill="#e0e9f3">A clearer view of the proposal.</text><text x="48" y="473" font-family="Arial,sans-serif" font-size="22" fill="white">Red outline: applicant's project area</text><text x="48" y="505" font-family="Arial,sans-serif" font-size="18" fill="#e0e9f3">Dashed line: 2-mile context buffer</text><text x="48" y="534" font-family="Arial,sans-serif" font-size="18" fill="#e0e9f3">Not a surveyed construction footprint</text><rect x="667" y="22" width="510" height="558" rx="4" fill="#f0f3ee"/>${panel(2,675,30,494,540)}<text x="674" y="606" font-family="Arial,sans-serif" font-size="16" fill="#e0e9f3">Source: SWCA application · Figure 2 / PDF p. 15</text><text x="48" y="601" font-family="Arial,sans-serif" font-size="17" fill="#b8d1e4">site-layer-4-project-record.vercel.app</text></svg>`;
await sharp(Buffer.from(social)).png().toFile(resolve(root,'public/social/site-layer-4-share-v2.png'));
console.log(JSON.stringify({sourceSHA256:createHash('sha256').update(readFileSync(pdf)).digest('hex'),pdfPages:[15,16],figures:[2,3],method:'PDF raster rendering; source map panels composed without geographic redrawing'},null,2));

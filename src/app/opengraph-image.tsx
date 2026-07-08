import { ImageResponse } from 'next/og';

export const alt = 'Vent — промышленная чистка вентиляции';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: '#f6f3ec',
          color: '#141312',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 18,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#1e5c32',
            display: 'flex',
          }}
        >
          Vent — est. 2021
        </div>
        <div
          style={{
            fontSize: 96,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            fontWeight: 300,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <span>Чистим то, что</span>
          <span style={{ color: '#1e5c32', fontStyle: 'italic' }}>никто не видит.</span>
        </div>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: 16,
            color: '#5a6b5e',
            display: 'flex',
          }}
        >
          Чистка вентиляции для общепита, офисов и складов
        </div>
      </div>
    ),
    { ...size },
  );
}

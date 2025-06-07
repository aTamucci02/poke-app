import { useState, useEffect } from 'react';

const TRANSLATE_ENDPOINT = 'https://translation.googleapis.com/language/translate/v2';
type LangCode = string;
// const BASE_CHAIN: LangCode[] = [
//   'ja', 'ar', 'zh-CN', 'fi', 'tr', 'eu', 'sw', 'hi', 'ko',
//   'el', 'he', 'vi', 'th', 'am', 'mi', 'is', 'hu', 'zu', 'cs', 'en'
// ];
// const CHAIN_LANGS: LangCode[] = [...BASE_CHAIN, ...BASE_CHAIN];

const BASE_CHAIN: LangCode[] = [
  'ja', 'sw', 'en'
];
const CHAIN_LANGS: LangCode[] = [...BASE_CHAIN];

export function useGoogleTranslate(entry: string) {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entry) {
      setResult('');
      return;
    }
    setLoading(true);
    setError(null);

    (async () => {
      try {
        let text = entry;
        for (const lang of CHAIN_LANGS) {
          const res = await fetch(
            `${TRANSLATE_ENDPOINT}?key=${import.meta.env.VITE_GOOGLE_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ q: text, target: lang }),
            }
          );
          const json = await res.json();
          if (json.error) {
            throw new Error(json.error.message);
          }
          text = json.data.translations[0].translatedText;
        }
        setResult(text);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('Translation chain error:', msg);
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [entry]);

  return { translated: result, loading, error };
}

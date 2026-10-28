import { Term } from './Glossary.jsx';

export function RichText({ text }) {
  return text.split(/(\[\[\w+\]\])/).map((part, i) => {
    const term = part.match(/^\[\[(\w+)\]\]$/);
    return term ? <Term key={i} id={term[1]} /> : part;
  });
}

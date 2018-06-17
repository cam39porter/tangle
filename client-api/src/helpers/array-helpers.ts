import { Urn } from "../urn/urn";

export function hydrate<T>(urns: Urn[], items: T[], toId: (t: T) => Urn): T[] {
  const order = urns.map(urn => urn.toRaw());
  return items.sort((a, b) => {
    return order.indexOf(toId(a).toRaw()) - order.indexOf(toId(b).toRaw());
  });
}

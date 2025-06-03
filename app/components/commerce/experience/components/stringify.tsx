import { ShopperExperienceTypes } from "commerce-sdk-isomorphic";

export default function Stringify({
  data,
}: ShopperExperienceTypes.Component) {
  return <div className="bg-red-500 p-4">{JSON.stringify(data)}</div>;
}

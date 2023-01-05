import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import awakes from "~/data/awake.json";

export function loader({ request }: LoaderArgs) {
  // get weapon type from params
  const params = new URL(request.url).searchParams;
  const query = params.get("q") ?? "";
  const weaponType = params.get("weaponType") ?? "";

  return json({
    awakes: awakes.find((skill) => skill.weaponType === weaponType)
      ?.skillAwakes,
    // ?.skillAwakes.filter((skill) =>
    //   skill.name.toLowerCase().includes(query.toLowerCase())
    // ),
  });
}

export function action({ params, request }: ActionArgs) {
  console.log(request);
  return json({});
}

export default function Index() {
  const { awakes } = useLoaderData<typeof loader>();

  return <p>test</p>;
}

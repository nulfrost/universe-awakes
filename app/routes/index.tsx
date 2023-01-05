import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
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
    weaponType: new URL(request.url).search,
  });
}

export function action({ params, request }: ActionArgs) {
  console.log(request);
  return json({});
}

export default function Index() {
  const { awakes, weaponType } = useLoaderData<typeof loader>();

  useEffect(() => {
    console.log(window.location.pathname);
  }, []);

  return (
    <>
      <h1 className="font-bold text-xl text-center pt-4 mb-4">
        Flyff Universe Awakes
      </h1>
      <nav>
        <ul className="flex flex-wrap justify-center gap-2">
          {[
            { label: "all", href: "/" },
            { label: "bow", href: "?weaponType=bow" },
            { label: "wand", href: "?weaponType=wand" },
            { label: "wand and staves", href: "?weaponType=wandorstaff" },
            { label: "staff", href: "?weaponType=staff" },
            { label: "swords and axes", href: "?weaponType=swordoraxe" },
            { label: "yoyo", href: "?weaponType=yoyo" },
            { label: "stick", href: "?weaponType=stick" },
            { label: "knuckle", href: "?weaponType=knuckle" },
          ].map((link) => (
            <li>
              <NavLink
                to={`${link.href}`}
                className={`${
                  weaponType === link.href
                    ? " bg-indigo-100 text-indigo-900"
                    : ""
                } text-sm px-2 py-1 rounded-sm flex items-center gap-1 text-gray-500`}
              >
                <>
                  <span> {link.label}</span>
                </>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

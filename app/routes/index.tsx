import { json, LoaderArgs } from "@remix-run/node";
import { NavLink, useLoaderData, useLocation } from "@remix-run/react";
import { useState } from "react";
import awakes from "~/data/awake.json";

export function loader({ request }: LoaderArgs) {
  // get weapon type from params
  const params = new URL(request.url).searchParams;
  const weaponType = params.get("weaponType") ?? "";

  return json({
    awakes:
      weaponType === ""
        ? awakes.flatMap((skill) => skill.skillAwakes)
        : awakes.find((skill) => skill.weaponType === weaponType)?.skillAwakes,
    weaponType: new URL(request.url).search,
  });
}

export default function Index() {
  const { awakes, weaponType } = useLoaderData<typeof loader>();

  const [searchQuery, setSearchQuery] = useState("");

  const location = useLocation();

  return (
    <>
      <h1 className="font-bold text-xl text-center pt-4 mb-4">
        Flyff Universe Awakes
      </h1>
      <nav>
        <ul className="flex md:justify-center mb-4 flex-col md:flex-row">
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
                  weaponType === link.href ||
                  (link.href === "/" && location.search === "")
                    ? " bg-indigo-100 text-indigo-900"
                    : "text-gray-500"
                } text-sm rounded-sm capitalize py-1 px-2 font-bold w-full inline-block text-center md:text-left`}
              >
                <span> {link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <input
        onChange={(e) => setSearchQuery(e.target.value)}
        autoFocus
        placeholder="Search"
        type="text"
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 mb-2 text-sm"
      />
      <div className=" gap-2 grid md:grid-cols-2 xl:grid-cols-3">
        {awakes
          ?.filter((skill) => skill.name.toLowerCase().includes(searchQuery))
          .map((skill) => (
            <SkillCard {...skill} />
          ))}
      </div>
    </>
  );
}

interface SkillCardProps {
  icon: string;
  name: string;
  id: string;
  level: number;
  probabilities: {
    uncommon: number[];
    rare: number[];
    unique: number[];
  };
}

function SkillCard(props: SkillCardProps) {
  return (
    <div className="bg-white border border-gray-200 p-2 rounded-sm flex flex-col shadow-sm">
      <div className="flex mb-2">
        <img
          src={props.icon}
          alt={`${props.name}`}
          height={40}
          width={40}
          className="mr-2"
        />
        <div>
          <h2 className="font-bold text-sm">{props.name}</h2>
          <p className="text-xs text-gray-500">Level {props.level}</p>
        </div>
      </div>
      <div className="mt-auto space-y-2">
        <p className="text-sm">
          <span className="text-amber-900 font-bold">Uncommon:</span>{" "}
          <span className="font-bold">
            {props.probabilities.uncommon.map((prob) => `${prob}%`).join(", ")}
          </span>
        </p>
        <p className="text-sm">
          <span className="text-green-900 font-bold">Rare:</span>{" "}
          <span className="font-bold">
            {props.probabilities.rare.map((prob) => `${prob}%`).join(", ")}
          </span>
        </p>
        <p className="text-sm">
          <span className="text-red-600 font-bold">Unique:</span>{" "}
          <span className="font-bold">
            {props.probabilities.unique.map((prob) => `${prob}%`).join(", ")}
          </span>
        </p>
      </div>
    </div>
  );
}

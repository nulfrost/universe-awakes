import { json, LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
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
      <h1 className="mb-4 text-xl font-bold text-center">
        Flyff Universe Awakes
      </h1>
      <nav>
        <ul className="flex flex-col mb-4 md:justify-center md:flex-row">
          {[
            { label: "all", href: "/" },
            { label: "bow", href: "?weaponType=bow" },
            { label: "wand", href: "?weaponType=wand" },
            { label: "wands and staves", href: "?weaponType=wandorstaff" },
            { label: "staff", href: "?weaponType=staff" },
            { label: "swords and axes", href: "?weaponType=swordoraxe" },
            { label: "shield", href: "?weaponType=shield" },
            { label: "yoyo", href: "?weaponType=yoyo" },
            { label: "stick", href: "?weaponType=stick" },
            { label: "knuckle", href: "?weaponType=knuckle" },
          ].map(({ label, href }) => (
            <li key={JSON.stringify({ label, href })}>
              <Link
                to={`${href}`}
                className={`${
                  weaponType === href ||
                  (href === "/" && location.search === "")
                    ? " bg-indigo-100 text-indigo-900"
                    : "text-gray-500"
                } text-sm rounded-sm capitalize py-1 px-2 font-bold w-full inline-block text-center md:text-left`}
              >
                <span> {label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        onChange={(e) => setSearchQuery(e.target.value)}
        autoFocus
        name="search"
        id="search"
        placeholder="Search"
        aria-label="Start typing to filter results"
        type="text"
        className="block w-full mb-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {awakes
          ?.filter((skill) =>
            skill.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((skill) => (
            <SkillCard {...skill} key={skill.id} />
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
    <div className="flex flex-col p-2 bg-white border border-gray-200 rounded-sm shadow-sm">
      <div className="flex mb-2">
        <img
          src={props.icon}
          alt={`${props.name}`}
          height={40}
          width={40}
          className="mr-2"
        />
        <div>
          <h2 className="text-sm font-bold">{props.name}</h2>
          <p className="text-xs text-gray-500">
            Minimum weapon level: {props.level}
          </p>
        </div>
      </div>
      <div className="mt-auto space-y-2">
        <p className="text-sm">
          <span className="font-bold text-amber-900">Uncommon:</span>{" "}
          <span className="font-bold">
            {props.probabilities.uncommon.map((prob) => `${prob}%`).join(", ")}
          </span>
        </p>
        <p className="text-sm">
          <span className="font-bold text-green-900">Rare:</span>{" "}
          <span className="font-bold">
            {props.probabilities.rare.map((prob) => `${prob}%`).join(", ")}
          </span>
        </p>
        {!props.probabilities.unique.length ? null : (
          <p className="text-sm">
            <span className="font-bold text-red-600">Unique:</span>{" "}
            <span className="font-bold">
              {props.probabilities.unique.map((prob) => `${prob}%`).join(", ")}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

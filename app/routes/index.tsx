import { json, LoaderArgs } from "@remix-run/node";
import {
  Form,
  NavLink,
  useLoaderData,
  useLocation,
  useSubmit,
} from "@remix-run/react";
import { FormEvent, useRef } from "react";
import awakes from "~/data/awake.json";

export function loader({ request }: LoaderArgs) {
  // get weapon type from params
  const params = new URL(request.url).searchParams;
  const weaponType = params.get("weaponType") ?? "";
  const searchTerm = params.get("q") ?? "";

  return json({
    awakes:
      weaponType === ""
        ? awakes.flatMap((skill) => skill.skillAwakes)
        : awakes.find((skill) => skill.weaponType === weaponType)?.skillAwakes,
    weaponType: new URL(request.url).search,
    searchTerm,
  });
}

export default function Index() {
  const { awakes, weaponType, searchTerm } = useLoaderData<typeof loader>();

  const submit = useSubmit();

  const location = useLocation();
  const searchFormRef = useRef<HTMLFormElement | null>(null);

  return (
    <>
      <h1 className="mb-4 text-xl font-bold text-center">
        Flyff Universe Awakes
      </h1>
      <nav>
        <ul className="flex flex-col mb-4 md:justify-center md:flex-row">
          {[
            { label: "all", href: "/" },
            { label: "bow", href: "bow" },
            { label: "wand", href: "wand" },
            { label: "wands and staves", href: "wandorstaff" },
            { label: "staff", href: "staff" },
            { label: "swords and axes", href: "swordoraxe" },
            { label: "shield", href: "shield" },
            { label: "yoyo", href: "yoyo" },
            { label: "stick", href: "stick" },
            { label: "knuckle", href: "knuckle" },
          ].map(({ label, href }) => (
            <li key={JSON.stringify({ label, href })}>
              <NavLink
                to={(() => {
                  let params = new URLSearchParams(location.search);
                  params.set("weaponType", href);
                  if (href === "/") {
                    params.delete("weaponType");
                    params.delete("q");
                  }
                  return location.pathname + "?" + params.toString();
                })()}
                className={`${
                  weaponType.split("=").at(1) === href ||
                  (href === "/" && location.search === "")
                    ? " bg-indigo-100 text-indigo-900"
                    : "text-gray-500"
                } text-sm rounded-sm capitalize py-1 px-2 font-bold w-full inline-block text-center md:text-left`}
              >
                <span> {label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <Form
        ref={searchFormRef}
        action={(() => {
          let params = new URLSearchParams(location.search);
          return location.pathname + "?" + params.toString();
        })()}
        onChange={(event: FormEvent<HTMLFormElement>) => {
          let params = new URLSearchParams(location.search);
          let query = Array.from(event.currentTarget.elements).at(
            0
          ) as HTMLInputElement;
          params.append("q", query.value);
          submit(event.currentTarget, { method: "get", replace: true });
        }}
      >
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          autoFocus
          name="q"
          id="search"
          placeholder="Search for a skill"
          maxLength={130}
          aria-label="Start typing to filter search results"
          type="text"
          className="block w-full mb-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </Form>
      <div className="grid gap-2 md:grid-cols-2">
        {awakes
          ?.filter((skill) =>
            skill.name.toLowerCase().includes(searchTerm.toLowerCase())
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

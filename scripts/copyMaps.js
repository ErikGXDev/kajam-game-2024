import * as fs from "fs";

// Copies maps from source to target

// Used because original map files are too large for public distribution
// and would require the .ldtk file to also be public

const source = "maps/mainMap/simplified";
const target = "public/maps";
const files = fs.readdirSync(source);

files.forEach((file) => {
  const sourcePath = `${source}/${file}`;
  const targetPath = `${target}/${file}`;

  console.log("Copying", sourcePath, "to", targetPath);

  fs.copyFileSync(`${sourcePath}/data.json`, `${targetPath}/data.json`);
  fs.copyFileSync(`${sourcePath}/_composite.png`, `${targetPath}/map.png`);

  // read AgentGrid.csv, convert to JSON and write to target
  const csv = fs.readFileSync(`${sourcePath}/AgentGrid.csv`, "utf8");
  const rows = csv.split("\n");
  const data = rows.map((row) => row.split(",").filter((cell) => cell !== ""));
  const json = JSON.stringify(data);

  fs.writeFileSync(`${targetPath}/nav.json`, json);
});

import "./style.css";
import "./kaplay";
import "./scenes/mainMenu";
import "./scenes/game";
import { k } from "./kaplay";
import { loadAssets } from "./loadAssets";

loadAssets();

k.go("mainMenu");

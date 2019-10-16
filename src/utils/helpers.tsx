import {Environment, EnvironmentType} from "@microsoft/sp-core-library";

export const isDbg = (Environment.type === EnvironmentType.Local) || window.location.search.toLowerCase().indexOf('loadspfx=true') >= 0 || window.location.search.toLowerCase().indexOf("isdbg") >= 0;

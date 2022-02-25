export const FOLDER = ".folder";
export const FOLDER1 = "folder";
export const FOLDER2 = "文件夹";

export const DOC = ".doc";
export const DOC1 = "doc";
export const DOCX = ".docx";
export const DOCX1 = "docx";
export const PPT = ".ppt";
export const PPT1 = "ppt";
export const PPTX = ".pptx";
export const PPTX1 = "pptx";
export const XLS = ".xls";
export const XLS1 = "xls";
export const XLSX = ".xlsx";
export const XLSX1 = "xlsx";

export const PNG = ".png";
export const PNG1 = "png";
export const JPG = ".jpg";
export const JPG1 = "jpg";
export const PDF = ".pdf";
export const PDF1 = "pdf";

export const TXT = ".txt";
export const TXT1 = "txt";
export const LOG = ".log";
export const LOG1 = "log";
// export const JSON = 'json' || '.json'
export const JSON = ".json";
export const JSON1 = "json";

export const MP3 = ".mp3";
export const MP31 = "mp3";
export const WMV = ".wmv";
export const WMV1 = "wmv";
export const MP4 = ".mp4";
export const MP41 = "mp4";

export const EXE = ".exe";
export const EXE1 = "exe";

export const UNKNOW = ".*";
export const UNKNOW1 = "";

export const STYLE = ".style";
export const STYLE1 = "style";
export const HDF = ".hdf";
export const HDF1 = "hdf";
export const GEOJSON = ".geojson";
export const GEOJSON1 = "geojson";
export const SHAPEFILE = ".shp";
export const SHAPEFILE1 = "shp";
export const ZIP = ".zip";
export const ZIP1 = "zip";
export const WT = ".wt";
export const WT1 = "wt";
export const WL = ".wl";
export const WL1 = "wl";
export const WP = ".wp";
export const WP1 = "wp";
export const TIFF = ".tiff";
export const TIFF1 = "tiff";
export const TIF = ".tif";
export const TIF1 = "tif";
export const TDF = ".tdf";
export const TDF1 = "tdf";
export const MUT = ".mut";
export const MUT1 = "mut";
export const TABLE = ".table";
export const TABLE1 = "table";
export const MOSA = ".mosa";
export const GEOTABLE = ".geotable";

export const FileType = {
  UNKNOW,
  FOLDER,
  DOC,
  DOCX,
  PPT,
  PPTX,
  XLS,
  XLSX,
  PNG,
  JPG,
  PDF,
  TXT,
  LOG,
  JSON,
  MP3,
  WMV,
  MP4,
  EXE,
  STYLE,
  HDF,
  GEOJSON,
  SHAPEFILE,
  ZIP,
  WT,
  WL,
  WP,
  TIFF,
  TIF,
  MUT,
  TABLE,
  UNKNOW1,
  FOLDER1,
  DOC1,
  DOCX1,
  PPT1,
  PPTX1,
  XLS1,
  XLSX1,
  PNG1,
  JPG1,
  PDF1,
  TXT1,
  LOG1,
  JSON1,
  MP31,
  WMV1,
  MP41,
  EXE1,
  STYLE1,
  HDF1,
  GEOJSON1,
  SHAPEFILE1,
  ZIP1,
  WT1,
  WL1,
  WP1,
  TIFF1,
  TIF1,
  MUT1,
  TABLE1,
  MOSA,
  GEOTABLE
};

export function validTileData(type) {
  let tile = false;
  type = type.toLowerCase();
  switch (type) {
    case TDF:
    case MUT:
    case TDF1:
    case MUT1:
      tile = true;
      break;
  }
  return tile;
}

export function validVectorData(type) {
  let gis = false;
  type = type.toLowerCase();
  switch (type) {
    case GEOJSON:
    case SHAPEFILE:
    case WT:
    case WL:
    case WP:
    case GEOJSON1:
    case SHAPEFILE1:
    case WT1:
    case WL1:
    case WP1:
      gis = true;
      break;
  }
  return gis;
}

export function validGeoData(type) {
  let gis = false;
  type = type.toLowerCase();
  switch (type) {
    case GEOJSON:
    case SHAPEFILE:
    case WT:
    case WL:
    case WP:
    case TIFF:
    case TIF:
    case TDF:
    case MUT:
    case ZIP:
    case JSON:
    case GEOJSON1:
    case SHAPEFILE1:
    case WT1:
    case WL1:
    case WP1:
    case TIFF1:
    case TIF1:
    case TDF1:
    case MUT1:
    case ZIP1:
    case JSON1:
    case MOSA:
    case GEOTABLE:
      gis = true;
      break;
  }
  return gis;
}

export function validGisData(type) {
  let gis = false;
  type = type.toLowerCase();
  switch (type) {
    case STYLE:
    case HDF:
    case GEOJSON:
    case SHAPEFILE:
    case WT:
    case WL:
    case WP:
    case TDF:
    case MUT:
    case TABLE:
    case ZIP:
    case JSON:
    case STYLE1:
    case HDF1:
    case GEOJSON1:
    case SHAPEFILE1:
    case WT1:
    case WL1:
    case WP1:
    case TDF1:
    case MUT1:
    case TABLE1:
    case ZIP1:
    case JSON1:
    case MOSA:
    case GEOTABLE:
      // case TIFF:
      // case TIF:
      // case TIFF1:
      // case TIF1:
      gis = true;
      break;
  }
  return gis;
}

export function getFileIcon(name) {
  switch (name) {
    case DOC:
    case DOCX:
    case DOC1:
    case DOCX1:
      return "icondoc";
    case PPT:
    case PPTX:
    case PPT1:
    case PPTX1:
      return "iconppt";
    case XLS:
    case XLSX:
    case XLS1:
    case XLSX1:
      return "iconxls";
    case FOLDER:
    case FOLDER1:
    case FOLDER2:
      return "mapgis-tubiaoqietu_wenjianjia-29";
    case PNG:
    case JPG:
    case PNG1:
    case JPG1:
      return "icontupian";
    case PDF:
    case PDF1:
      return "iconpdf";
    case TXT:
    case TXT1:
      return "icontxt";
    case LOG:
    case LOG1:
      return "iconlog";
    case JSON:
    case JSON1:
      return "iconjson";
    case MP3:
    case WMV:
    case MP31:
    case WMV1:
      return "iconyinle";
    case MP4:
    case MP41:
      return "iconshipin";
    case EXE:
    case EXE1:
      return "iconexe";
    case GEOJSON:
    case GEOJSON1:
      return "iconGeoJson";
    case SHAPEFILE:
    case SHAPEFILE1:
      return "iconS";
    case HDF:
    case HDF1:
      return "iconGeometry";
    case WT:
    case WT1:
      return "iconvector-point";
    case WL:
    case WL1:
      return "iconvectorline";
    case WP:
    case WP1:
      return "iconvectorsquare";
    case TIF:
    case TIF1:
    case TIFF:
    case TIFF1:
      return "icontiff";
    case TABLE:
    case TABLE1:
      return "icongrid";
    default:
      return "iconunknown";
  }
}

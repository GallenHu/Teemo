import Link from "@mui/joy/Link";
import ImageIcon from "../ImageIcon/index";
import type { Shortcut } from "../../types/shortcut";

type Props = Shortcut & {
  width?: string;
  plaintext?: boolean;
  sx?: object;
};

export default function (props: Props) {
  return (
    <Link
      href={props.plaintext ? undefined : props.url}
      target="_blank"
      color="primary"
      level="body-sm"
      underline="none"
      variant="plain"
      sx={{
        width: props.width || "100px",
        marginRight: "10px",
        padding: "6px 10px",
        borderRadius: "4px",
        ...props.sx,
      }}
    >
      {typeof props.icon === "string" ? (
        <ImageIcon src={props.icon} height="18px" />
      ) : typeof props.icon === "object" ? (
        props.icon
      ) : null}

      <span className="truncate" title={props.title}>
        {props.title}
      </span>
    </Link>
  );
}

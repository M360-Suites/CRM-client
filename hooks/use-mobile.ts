import * as React from "react";

const MOBILE_BREAKPOINT = 800;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    onChange(); // initial check via the named handler avoids direct setState in effect body
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

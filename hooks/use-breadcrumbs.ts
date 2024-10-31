"use client";

import { capitalizeFirstLetter } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  "/dashboard": [{ title: "Dashboard", link: "/dashboard" }],
  "/dashboard/employee": [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Employee", link: "/dashboard/employee" },
  ],
  "/dashboard/product": [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Product", link: "/dashboard/product" },
  ],
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      let title;

      if (segment.indexOf("-") > -1) {
        title = segment.replace("-", " ");
      } else {
        title = segment;
      }

      const path = `/${segments.slice(0, index + 1).join("/")}`;

      return {
        title: capitalizeFirstLetter(title),
        link: path,
      };
    });
  }, [pathname]);

  return breadcrumbs;
}

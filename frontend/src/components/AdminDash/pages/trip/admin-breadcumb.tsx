"use client";

import React, { useEffect, useState } from "react";
import { Link, useLocation, matchPath } from "react-router-dom";
import { useTripAPI } from "@/hooks/api.hook";
import { Spinner } from "@/components/ui/loader/_spinner";
import { HomeIcon, ChevronRight } from "lucide-react";
import { breadcrumbConfig } from "./breadcumbConfig";

interface BreadcrumbProps { }

const Breadcrumbs: React.FC<BreadcrumbProps> = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { getTripById } = useTripAPI();

  const [loading, setLoading] = useState<boolean>(false);

  const generateBreadcrumbs = async () => {
    const breadcrumbs: Array<{ breadcrumb: string; path: string }> = [];

    const recursiveSearch = async (config: typeof breadcrumbConfig) => {
      for (const item of config) {
        const match = matchPath(
          { path: item.url, end: false },
          pathname
        );

        if (match) {
          let label = "";

          if (typeof item.breadcrumb === "function") {
            const params = match.params as Record<string, string | undefined>;
            let dynamicName: string | undefined = undefined;

            if (item.url.includes(":id")) {
              const tripId = params.id;
              if (tripId) {
                setLoading(true);
                const trip = await getTripById(tripId);
                dynamicName = trip?.name;
              }
            }

            label = item.breadcrumb(params, dynamicName);
          } else {
            label = item.breadcrumb || item.title;
          }

          const resolvedPath = item.url.replace(
            /:([^/]+)/g,
            (_, key) => match.params[key] || ''
          );

          breadcrumbs.push({ breadcrumb: label, path: resolvedPath });

          if (item.children) {
            await recursiveSearch(item.children);
          }
        }
      }
    };

    await recursiveSearch(breadcrumbConfig);
    return breadcrumbs;
  };

  const [breadcrumbs, setBreadcrumbs] = useState<
    Array<{ breadcrumb: string; path: string }>
  >([]);

  useEffect(() => {
    const fetchBreadcrumbs = async () => {
      setLoading(true); // Start loading before fetching
      const crumbs = await generateBreadcrumbs();
      setBreadcrumbs(crumbs);
      setLoading(false); // End loading after fetching
    };

    fetchBreadcrumbs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <nav className="flex bg-yellow-300 rounded-lg p-2" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {/* Home Breadcrumb */}
        <li className="inline-flex items-center">
          <Link
            to="/admin/products"
            className="flex items-center text-sm font-semibold text-black"
          >
            <HomeIcon color="black" className="w-4 h-4 mr-1" />
            Admin
          </Link>
          {breadcrumbs.length > 0 && (
            <ChevronRight size={17} className="ml-2" />

          )}
        </li>
        {/* Dynamic Breadcrumbs */}
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="inline-flex items-center">
            <Link
              to={crumb.path}
              className={`text-sm text-black font-semibold ${index === breadcrumbs.length - 1
                  ? "text-gray-500 pointer-events-none"
                  : "text-gray-700 hover:text-blue-600"
                } truncate max-w-xs flex items-center`}
              aria-current={index === breadcrumbs.length - 1 ? "page" : undefined}
            >
              {crumb.breadcrumb}
            </Link>
            {index < breadcrumbs.length - 1 && (
                         <ChevronRight size={17} className="ml-2" />

            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

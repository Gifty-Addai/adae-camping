import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Button } from "./button";
import { setAppLoading } from "@/core/store/slice/app.slice";
import { RootState } from "@/core/store/store";
import { Input } from "./input";
import { Helmet } from "react-helmet";

type IPageProp = {
  goBack: () => void
}

type ISearchProp = {
  enabled?: boolean;
  isSearching?: boolean;
  placeholder?: string;
  onSearch?: (value: string) => void;
}

type MixedArray = (string | (() => void))[];
type IProps = {
  renderBody?: (page: IPageProp) => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  backInfo?: MixedArray;
  searchProp?: ISearchProp;
  pageTitle?: string;
  scrollable?: boolean;
  isLoading?: boolean;
  // Advanced SEO fields
  seoDescription?: string;
  seoKeywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
}

export const Page = ({
  renderBody,
  renderFooter,
  pageTitle,
  backInfo,
  scrollable = false,
  isLoading = false,
  searchProp,
  seoDescription,
  seoKeywords,
  canonicalPath,
  ogImage,
  ogType = 'website',
}: IProps) => {
  const dispatch = useDispatch();
  const appState = useSelector((state: RootState) => state.appSlice);

  useEffect(() => {
    console.log("Page is loading", isLoading);
    dispatch(setAppLoading(isLoading));
  }, [isLoading]);

  const goBack = () => {
    if (backInfo && backInfo.length >= 1) {
      if (typeof backInfo[1] === "string") window.location.href = backInfo[1];
      if (typeof backInfo[1] === "function") backInfo[1]();
    }
  };

  const pageProps: IPageProp = {
    goBack,
  };

  const appName = appState?.appName || 'The Ancestral Tallow';
  const computedTitle = pageTitle 
    ? `${pageTitle} | ${appName}`
    : `${appName} | Pure Grass-Fed & Finished Tallow & Ghee`;

  const defaultDescription = "Pure, ancestral tallow and ghee products crafted traditionally in Ghana. Sourced from locally raised grass-fed cattle, sheep, and goats.";
  const defaultKeywords = "tallow, ghee, beef tallow, goat tallow, sheep tallow, grass-fed tallow, ancestral tallow, healthy cooking oils, skincare, Ghana, Accra";

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ancestraltallow.gh';
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const canonicalUrl = `${origin}${canonicalPath || path}`;

  return (
    <>
      <Helmet>
        {/* Dynamic Page Title */}
        <title>{computedTitle}</title>

        {/* Dynamic Meta Description */}
        <meta name="description" content={seoDescription || defaultDescription} />

        {/* Dynamic Meta Keywords */}
        <meta name="keywords" content={seoKeywords || defaultKeywords} />

        {/* Dynamic Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph Tags */}
        <meta property="og:title" content={computedTitle} />
        <meta property="og:description" content={seoDescription || defaultDescription} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonicalUrl} />
        {ogImage && <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${origin}${ogImage}`} />}

        {/* Twitter Card Tags */}
        <meta name="twitter:title" content={computedTitle} />
        <meta name="twitter:description" content={seoDescription || defaultDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${origin}${ogImage}`} />}
      </Helmet>

      <div
        className={cn(
          "flex-1 overflow-y-auto mt-0 px-0 py-0 relative mx-auto",
          "max-w-[920px]",
          renderFooter != undefined && "-mb-10 pb-12 max-h-[97vh]",
          scrollable && "max-h-[100vh]"
        )}
      >
        <div className="w-full px-0 flex justify-between items-center gap-[10px] cursor-pointer">
          {(backInfo && backInfo.length >= 1) && (
            <div className="w-max">
              <Button
                onClick={goBack}
                variant="link"
                size={"sm"}
                className="font-semibold m-0 !px-0 text-gray-700"
              >
                <ChevronLeft className="inline-block w-3 h-3 mr-2 text-gray-500" />
                {backInfo[0] as string}
              </Button>
            </div>
          )}

          {searchProp && searchProp.enabled && (
            <div className="flex w-full">
              <div className="relative mx-auto min-w-[320px]">
                <Input
                  onChange={(v: any) => searchProp?.onSearch?.(v)}
                  placeholder={searchProp?.placeholder ?? "Search by item"}
                />
              </div>
            </div>
          )}
        </div>

        {renderBody != null && renderBody(pageProps)}
      </div>

      {/* Optional footer */}
      {renderFooter != null && (
        <div className="border-t border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
          {renderFooter()}
        </div>
      )}
    </>
  );
};

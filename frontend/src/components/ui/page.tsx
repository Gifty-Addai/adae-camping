import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Button } from "./button";
import { setAppLoading } from "@/core/store/slice/app.slice";
import { RootState } from "@/core/store/store";
import { Input } from "./input";

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
}
export const Page = ({
  renderBody,
  renderFooter,
  pageTitle,
  backInfo,
  scrollable = false,
  isLoading = false,
  searchProp,
}: IProps) => {
  const dispatch = useDispatch();

  const appState = useSelector((state: RootState) => state.appSlice);

  useEffect(() => {
    dispatch(setAppLoading(isLoading));
  }, [isLoading]);

  useEffect(() => {
    document.title = `${appState?.appName} :: ${pageTitle}`;
  }, [pageTitle]);

  const goBack = () => {
    if (backInfo && backInfo.length >= 1) {
      if (typeof backInfo[1] === "string") window.location.href = backInfo[1];
      if (typeof backInfo[1] === "function") backInfo[1]();
    }
  };

  const pageProps: IPageProp = {
    goBack,
  };

  return (
    <>
      <div
        className={cn(
          "flex-1 overflow-y-auto px-4 py-16 relative mx-auto",
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



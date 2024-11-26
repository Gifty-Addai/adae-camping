/* import classNames from "classnames"
 */import { cn } from "@/lib/utils"

type IProp = {className?:string}
export const DotLoader = (prop:IProp) => {

    return <>
        <span className="dots-cont">
            {[1,2,3].map((x, i)=><span key={i} className={cn("dot dot-"+x, prop?.className)}></span>)} 
        </span>
    </>
}
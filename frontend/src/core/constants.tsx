import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { AppDispatch, RootState } from "./store/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const isDev = process.env.NODE_ENV === 'development';


export const app_local_storage_key = "adae-int";
export const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEN_BASE_URL;

export const dateFormat = 'yyyy-MM-DD'
export const timeFormat= "HH:mm:ss";

export const imageSchema = z.object({
	size: z.number({ required_error: " " }).refine((size) => size > 0 && size <= 2097152, {
		message: "File size should not be more than 2MB",
	}),
	type: z.string({ required_error: "Avatar is required" }).refine((type) => ["image/png", "image/jpeg"].includes(type), {
		message: "Only PNG, and JPEG files are allowed",
	}),
});

export const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
export const CHANNEL_ID = process.env.CHANNEL_ID;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const phoneNumberSchema = z.string({ required_error: "An phone number is required" }).refine(isValidPhoneNumber, "Invalid phone number entered");
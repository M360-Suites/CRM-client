import { StarterTemplate } from "@/types/bulk_email";
import { createDefaultDesign } from "../../email_editor/design";
import bigSale from "./big_sale";
import campaignUpdates from "./campaign_updates";
import courseWelcome from "./course_welcome";
import newsletterWelcome from "./newsletter_welcome";
import productSpotlight from "./product_spotlight";
import schoolUpdates from "./school_updates";
import weeklyUpdates from "./weekly_updates";
import wellnessLaunch from "./wellness_launch";
import sleepWeekSale from "./sleep_week_sale";
import flashSale from "./flash_sale";
import ingredientSpotlight from "./ingredient_spotlight";
import meetTheProduct from "./meet_the_product";
import techCollection from "./tech_collection";
import bestsellerStory from "./bestseller_story";
import newColorway from "./new_colorway";
import organizers from "./organizers";
import styleSpotlight from "./style_spotlight";
import lookbook from "./lookbook";
import seasonalRomance from "./seasonal_romance";
import productVariants from "./product_variants";
import shopByColour from "./shop_by_colour";
import seasonTrends from "./season_trends";
import sitewideSale from "./sitewide_sale";
import certificationPaths from "./certification_paths";
import monthlyDigest from "./monthly_digest";
import limitedOffer from "./limited_offer";
import biggestSale from "./biggest_sale";
import kidsLearningWelcome from "./kids_learning_welcome";
import travelDestinations from "./travel_destinations";
import holidayEdition from "./holiday_edition";
import digitalAgency from "./digital_agency";

// Starter designs shown in "Choose a template to customize", built from the
// email designs in the CRM-360 Figma file (High Fidelity page). Picking one
// copies it into a real template through the API. Images are placeholders
// from public/assets/templates for people to swap for their own.
export const LIBRARY_TEMPLATES: StarterTemplate[] = [
	newsletterWelcome,
	weeklyUpdates,
	campaignUpdates,
	schoolUpdates,
	courseWelcome,
	{
		_id: "lib-simple",
		name: "Simple Announcement",
		description: "A header image, a short message and one button. A clean place to start.",
		category: "classic",
		design: createDefaultDesign(),
	},
	productSpotlight,
	bigSale,
	wellnessLaunch,
	sleepWeekSale,
	flashSale,
	ingredientSpotlight,
	meetTheProduct,
	techCollection,
	bestsellerStory,
	newColorway,
	organizers,
	styleSpotlight,
	lookbook,
	seasonalRomance,
	productVariants,
	shopByColour,
	seasonTrends,
	sitewideSale,
	certificationPaths,
	monthlyDigest,
	limitedOffer,
	biggestSale,
	kidsLearningWelcome,
	travelDestinations,
	holidayEdition,
	digitalAgency,
];

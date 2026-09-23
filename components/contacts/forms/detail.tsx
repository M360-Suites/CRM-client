import { useContactStore } from "@/stores/contact/contact_store";
import { CustomButton } from "@/components/custom/common/customButton";
import { CustomDrawer } from "@/components/custom/common/drawer";
import EditContactForm from "./edit_contact";
import { ContactTabs, getInitials, toUTC } from "@/lib/utils";

interface ContactDetailsSheetProps {
	onDelete: () => void;
	isLoading?: boolean;
}

export default function Detail({
	onDelete,
	isLoading,
}: ContactDetailsSheetProps) {
	const { selectedContact } = useContactStore();

	console.log("selectedContact", selectedContact);

	return (
		<div className="p-4 flex flex-col gap-10">
			<div className="flex flex-row items-start gap-4 flex-1">
				<div className="bg-[#D8F3F1] h-10 w-10 rounded-full flex items-center justify-center text-base font-medium text-[#2F9E94]">
					{getInitials(
						selectedContact?.first_name +
							" " +
							selectedContact?.last_name || "",
					)}
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex flex-col items-start">
						<span className="text-sm font-normal">
							{selectedContact?.first_name +
								" " +
								selectedContact?.last_name}
						</span>
						<span className="text-sm font-medium text-foreground">
							{selectedContact?.role_title}
						</span>
					</div>
					<div
						className={`px-3 py-1 flex max-md:justify-center rounded-full md:text-sm text-xs self-auto font-medium ${
							selectedContact?.temperature?.toLocaleLowerCase() ===
							ContactTabs.HOT.toLocaleLowerCase()
								? "bg-[#0091FE] text-white"
								: selectedContact?.temperature ===
									  ContactTabs.WARM.toLocaleLowerCase()
									? "bg-[#00B3A6] text-white"
									: "bg-[#94A3B8] text-white"
						}`}
					>
						<span className="md:text-sm text-xs font-normal self-center ">
							{selectedContact?.temperature}
						</span>
					</div>
				</div>
			</div>
			<div className="flex flex-col w-full">
				<div className="py-2 flex justify-between w-full">
					<span>Email</span>
					<p className="text-sm text-foreground/70">
						{selectedContact?.email}
					</p>
				</div>
				<div className="py-2 flex justify-between w-full">
					<span>Phone</span>
					<p className="text-sm text-foreground/70">
						{selectedContact?.phone}
					</p>
				</div>
				<div className="py-2 flex justify-between w-full">
					<span>Tags</span>
					<p className="text-sm text-foreground/70">----</p>
				</div>
				<div className="py-2 flex justify-between w-full">
					<span>Last Contacted</span>
					<p className="text-sm text-foreground/70">
						{toUTC(selectedContact?.created_at)}
					</p>
				</div>
			</div>
			<div className="flex flex-col gap-4">
				<span className="text-base font-medium text-foreground">
					Activity Timeline
				</span>
				<div className="border border-dashed border-border rounded-[8px] py-18 flex justify-center items-center">
					<span className="text-sm text-foreground">
						No activity yet
					</span>
				</div>
			</div>
			<div className="flex flex-row items-center gap-4 w-full">
				<CustomButton
					variant={"outline"}
					onClick={onDelete}
					className="py-4 px-5 flex-1 text-base"
				>
					{isLoading ? "Deleting..." : "Delete"}
				</CustomButton>

				<CustomDrawer
					label="Edit Contact"
					trigger={
						<CustomButton
							className="py-4 px-5 flex-1"
							onClick={() => {}}
						>
							Edit Contact
						</CustomButton>
					}
				>
					{(close) =>
						selectedContact ? (
							<EditContactForm
								contact={selectedContact}
								onSuccess={() => {
									close();
								}}
							/>
						) : null
					}
				</CustomDrawer>
			</div>
		</div>
	);
}

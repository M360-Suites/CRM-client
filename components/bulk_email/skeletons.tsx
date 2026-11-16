import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Loading placeholders for the bulk email screens, shaped like the content
// they stand in for. Spinners are kept only for actions (sending, uploading).

export const Bone = ({ className, ...props }: React.ComponentProps<"div">) => (
	<Skeleton className={cn("bg-[#E9EEF3]", className)} {...props} />
);

// Widths cycle per row so the placeholder doesn't look like a solid block
const WIDTHS = ["w-3/4", "w-1/2", "w-2/3", "w-5/6", "w-2/5"];

// Rows for a <tbody>; the real <thead> stays visible above them
export function TableRowsSkeleton({ cols, rows = 6 }: { cols: number; rows?: number }) {
	return (
		<>
			{Array.from({ length: rows }, (_, r) => (
				<tr key={r} className="border-b border-[#F1F5F9] last:border-b-0">
					{Array.from({ length: cols }, (_, c) => (
						<td key={c} className="py-4 px-4">
							<Bone className={cn("h-3.5", WIDTHS[(r + c) % WIDTHS.length])} />
						</td>
					))}
				</tr>
			))}
		</>
	);
}

// Bulk email list: search, status tabs and the broadcasts table
export function BroadcastListSkeleton() {
	return (
		<div className="w-full flex flex-col gap-8">
			<div className="flex max-lg:flex-col max-lg:gap-3 max-lg:items-start items-center justify-between w-full">
				<Bone className="h-12 xl:w-xl md:w-sm w-full rounded-full" />
				<div className="flex gap-1">
					{[20, 16, 20, 16, 14].map((w, i) => (
						<Bone key={i} className="h-10 rounded-full" style={{ width: w * 4 }} />
					))}
				</div>
			</div>
			<div className="w-full overflow-x-auto">
				<table className="w-full min-w-[860px]">
					<thead className="bg-[#F1F5F9]">
						<tr>
							<th className="h-[52px]" colSpan={6} />
						</tr>
					</thead>
					<tbody>
						<TableRowsSkeleton cols={6} rows={8} />
					</tbody>
				</table>
			</div>
		</div>
	);
}

export function TemplateGridSkeleton({ count = 8 }: { count?: number }) {
	return (
		<div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-7 max-w-[1100px]">
			{Array.from({ length: count }, (_, i) => (
				<div key={i} className="flex flex-col border border-[#E2E8F0] bg-white aspect-[25/28] overflow-hidden">
					<Bone className="h-[38%] min-h-24 rounded-none" />
					<div className="flex flex-1 flex-col gap-2.5 px-4 pt-4 pb-5">
						<Bone className="h-3.5 w-2/3" />
						<Bone className="h-2.5 w-full" />
						<Bone className="h-2.5 w-5/6" />
						<Bone className="h-2.5 w-1/2" />
						<Bone className="mt-auto h-6 w-24" />
					</div>
				</div>
			))}
		</div>
	);
}

// The email canvas (toolbar strip + content card) and the settings column
export function CanvasSkeleton() {
	return (
		<div className="flex flex-col">
			<div className="flex gap-1.5 rounded-t-md border border-[#E2E8F0] bg-white px-2 py-2">
				{Array.from({ length: 12 }, (_, i) => (
					<Bone key={i} className="h-6 w-6" />
				))}
			</div>
			<div className="flex justify-center rounded-b-md border border-t-0 border-[#E2E8F0] bg-[#F8FAFC] px-3 py-10 md:px-10">
				<div className="flex w-full max-w-[600px] flex-col gap-4 bg-white p-8">
					<Bone className="h-40 w-full" />
					<Bone className="h-5 w-2/3" />
					<Bone className="h-3 w-full" />
					<Bone className="h-3 w-11/12" />
					<Bone className="h-3 w-4/5" />
					<Bone className="mt-2 h-9 w-36 rounded-full" />
				</div>
			</div>
		</div>
	);
}

export function SettingsSkeleton() {
	return (
		<div className="flex flex-col gap-4 rounded-md border border-[#E2E8F0] bg-white p-4">
			<Bone className="h-4 w-24" />
			{Array.from({ length: 4 }, (_, i) => (
				<div key={i} className="grid grid-cols-2 gap-3">
					<Bone className="h-8" />
					<Bone className="h-8" />
				</div>
			))}
		</div>
	);
}

// A whole editor page (broadcast or template) while its data loads
export function EditorPageSkeleton() {
	return (
		<div className="w-full flex flex-col gap-10 pt-8 pb-24">
			<div className="flex items-center justify-between gap-4">
				<Bone className="h-7 w-64 max-w-full" />
				<div className="flex gap-3">
					<Bone className="h-8 w-8 rounded-full" />
					<Bone className="h-8 w-24 rounded-full" />
				</div>
			</div>
			<div className="flex max-lg:flex-col items-start gap-6 w-full">
				<div className="flex-1 min-w-0 w-full flex flex-col gap-4">
					<div className="flex flex-col gap-2 rounded-md border border-[#E2E8F0] bg-white px-4 pt-5 pb-4">
						<Bone className="h-3 w-20" />
						<Bone className="h-9 w-full" />
					</div>
					<CanvasSkeleton />
				</div>
				<div className="lg:w-80 w-full shrink-0">
					<SettingsSkeleton />
				</div>
			</div>
		</div>
	);
}

// Broadcast report: title, stat tiles and the recipients table
export function ReportSkeleton() {
	return (
		<div className="w-full flex flex-col gap-8 pt-8 pb-8">
			<div className="flex flex-col gap-2">
				<Bone className="h-7 w-72 max-w-full" />
				<Bone className="h-4 w-56" />
				<Bone className="h-3 w-40" />
			</div>
			<div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-4">
				{Array.from({ length: 6 }, (_, i) => (
					<div key={i} className="flex flex-col gap-2 rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-4">
						<Bone className="h-3 w-16" />
						<Bone className="h-7 w-12" />
					</div>
				))}
			</div>
			<div className="w-full overflow-x-auto">
				<table className="w-full min-w-[720px]">
					<tbody>
						<TableRowsSkeleton cols={5} rows={6} />
					</tbody>
				</table>
			</div>
		</div>
	);
}

// Rows in a popover menu (templates, merge tags)
export function MenuItemsSkeleton({ rows = 4 }: { rows?: number }) {
	return (
		<div className="flex flex-col gap-2 px-2 py-1.5">
			{Array.from({ length: rows }, (_, i) => (
				<Bone key={i} className={cn("h-3.5", WIDTHS[i % WIDTHS.length])} />
			))}
		</div>
	);
}

import { apiClient } from "../apiclient";

interface DeleteAssignedUserData {
	userId: string;
	stageId: string;
}

export const DeleteAssignedUser = async ({
	userId,
	stageId,
}: DeleteAssignedUserData) => {
	const response = await apiClient.delete(
		`/pipeline/stages/${stageId}/assignees/${userId}`,
	);
	return response;
};

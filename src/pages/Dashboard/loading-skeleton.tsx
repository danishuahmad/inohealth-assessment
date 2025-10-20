import { Skeleton, Stack } from "@mui/material";

export const LoadingSkeleton = () => {

    return (
        <Stack gap={2}>
            <Skeleton variant="rectangular" width={"40%"} height={27} />
            <Skeleton variant="rectangular" width={"100%"} height={10} />
            <Skeleton variant="rectangular" width={"100%"} height={10} />
            <Skeleton variant="rectangular" width={"100%"} height={10} />
            <Stack height={400} />
            <Skeleton variant="rectangular" width={"100%"} height={10} />
            <Skeleton variant="rectangular" width={"100%"} height={10} />
            <Skeleton variant="rectangular" width={"100%"} height={10} />

        </Stack>
    );
}
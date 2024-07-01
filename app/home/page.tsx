"use client";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { fulfilled, getMovies, startLoading } from "@/lib/movies/moviesSlice";
import { FaEdit } from "react-icons/fa";

// @ts-ignore
const columns = (setEditing: (id: string) => void) => [
  {
    name: "Title",
    selector: (row: { movie_name: string }) => row.movie_name,
    sortable: true,
  },
  {
    name: "Actors",
    cell: (row: { actors: { _id: string; actor_name: string }[] }) => (
      <ul>
        {(row.actors || []).map(
          (actor: { _id: string; actor_name: string }) => (
            <li key={actor["_id"]}>{actor.actor_name}</li>
          ),
        )}
      </ul>
    ),
  },
  {
    name: "Producer",
    selector: (row: { producer: { producer_name: string } }) =>
      //@ts-ignore
      row?.producer?.[0]?.producer_name || "",
  },
  {
    name: "Edit",
    cell: (row: { _id: any }) => (
      <button onClick={() => setEditing(row._id)}>
        <FaEdit />
      </button>
    ),
  },
];
export default function Home() {
  const router = useRouter();
  const movies = useAppSelector((state) => state.movies);
  const dispatch = useDispatch();
  const [editingMovie, setEditingMovie] = useState<null | string>(null);
  const [currentPage, setCurrentPage] = useState<null | Number>(null);
  const [perPage, setPerPage] = useState<null | Number>(null);
  const currentPageRef = useRef<null | Number>(currentPage);
  const perPageRef = useRef<null | Number>(perPage);
  const getMoviesSegment = () => {
    let count = (perPage === null ? 10 : perPage) as number;
    let skip =
      (((currentPage === null ? 1 : currentPage) as number) - 1) * count;
    return (movies?.movies || []).find((segment: any) => {
      return segment.count === count && segment.skip === skip;
    });
  };

  const handlePageChange = (page: SetStateAction<Number | null>) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (
    newPerPage: SetStateAction<Number | null>,
    page: SetStateAction<Number | null>,
  ) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  useEffect(() => {
    router.refresh();
  }, []);

  const loadData = async (skip: number, count: number) => {
    // @ts-ignore
    dispatch(startLoading());
    const data = await getMovies({ skip, count });
    dispatch(fulfilled(data));
  };

  useEffect(() => {
    console.log(movies);

    if (
      currentPageRef.current !== currentPage ||
      perPageRef.current !== perPage
    ) {
      currentPageRef.current = currentPage || 1;
      perPageRef.current = perPage || 10;

      let count = (perPage === null ? 10 : perPage) as number;
      let skip =
        (((currentPage === null ? 1 : currentPage) as number) - 1) * count;
      let segmentToReturn = (movies?.movies || []).find((segment: any) => {
        return segment.count === count && segment.skip === skip;
      });
      if (!segmentToReturn) {
        // @ts-ignore
        loadData(skip, count);
      }
    }
  }, [currentPage, perPage]);

  return (
    <div className={"w-100 flex flex-col justify-start align-end"}>
      <DataTable
        // @ts-ignore
        columns={columns(setEditingMovie)}
        // @ts-ignore
        data={getMoviesSegment()?.data || []}
        pagination
        paginationServer
        paginationTotalRows={movies?.total}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        progressPending={movies?.state === "loading"}
      />
    </div>
  );
}

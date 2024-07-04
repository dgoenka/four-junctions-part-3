"use client";
import { useRouter } from "next/navigation";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import DataTable from "react-data-table-component";
import { useDispatch } from "react-redux";
import { fulfilled, getMovies, startLoading } from "@/lib/movies/moviesSlice";
import { FaEdit } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { getActors } from "@/lib/movies/actorsSlice";
import { getProducers } from "@/lib/movies/producersSlice";
import AsyncSelect from "react-select/async";

// @ts-ignore
const columns = (setEditing: (id: any) => void) => [
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
      <button onClick={() => setEditing(row)}>
        <FaEdit />
      </button>
    ),
  },
];

const EditDialog = ({
  addingMovie,
  editingMovie,
  hideAddEditDialog,
}: {
  addingMovie: boolean;
  editingMovie: any;
  hideAddEditDialog: Function;
}) => {
  // @ts-ignore

  const formSubmit = (e) => {
    e.preventDefault();
  };

  const actorPromiseOptions = async (inputValue: string) => {
    const data = getActors({ search: inputValue });
    // @ts-ignore
    return (data?.data || []).map((actor) => ({
      label: actor.actor_name,
      value: actor._id,
    }));
  };

  const producerPromiseOptions = async (inputValue: string) => {
    const data = getProducers({ search: inputValue });
    // @ts-ignore
    return (data?.data || []).map((producer) => ({
      label: producer.producer_name,
      value: producer._id,
    }));
  };

  return (
    <div
      id="modal-id"
      aria-hidden="true"
      className={`
         overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full
         flex flex-col items-center justify-center
      `}
    >
      <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="flex flex-row items-center justify-between p-3">
            <h5 className="text-xl font-medium leading-normal ">
              {addingMovie ? "Add Movie" : "Edit Movie"}
            </h5>
            <button
              type="button"
              data-modal-toggle="modal-id"
              className="text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:text-gray-500 hover:scale-110 ml-4 md:ml-6"
              //@ts-ignore
              onClick={hideAddEditDialog}
            >
              <IoIosClose size={40} />
            </button>
          </div>

          <form
            onSubmit={formSubmit}
            className="login w-max min-w-full max-w-full p-3 select-none"
          >
            <input type={"hidden"} name={"_id"} value={editingMovie?._id} />
            <table
              className={
                "w-max border-spacing-3 space-3 w-100 min-w-full max-w-full"
              }
            >
              <colgroup>
                <col span={1} width={"50%"} />
                <col span={1} width={"50%"} />
              </colgroup>
              <tr>
                <td>Movie Name</td>
                <td>
                  <input
                    type={"text"}
                    name={"movie_name"}
                    required
                    defaultValue={editingMovie?.movie_name}
                  />
                </td>
              </tr>
              <tr>
                <td>Actors</td>
                <td>
                  <AsyncSelect
                    isMulti
                    cacheOptions
                    {...(editingMovie
                      ? {
                          defaultValue: (editingMovie?.actors || []).map(
                            (actor: { actor_name: any; _id: any }) => ({
                              label: actor.actor_name,
                              value: actor._id,
                            }),
                          ),
                        }
                      : {})}
                    loadOptions={actorPromiseOptions}
                  />
                </td>
              </tr>
              <tr>
                <td>Producer</td>
                <td>
                  <AsyncSelect
                    cacheOptions
                    {...(editingMovie
                      ? {
                          defaultValue: editingMovie?.producer
                            ? {
                                label:
                                  editingMovie?.producer?.[0]?.producer_name,
                                value: editingMovie?.producer?.[0]?._id,
                              }
                            : null,
                        }
                      : {})}
                    loadOptions={producerPromiseOptions}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <button className={"btn main-btn mb-2"} type={"submit"}>
                    Submit
                  </button>
                </td>
                <td>
                  <button
                    className={"btn secondary-btn mb-2"}
                    type={"button"}
                    //@ts-ignore
                    onClick={hideAddEditDialog}
                  >
                    Cancel
                  </button>
                </td>
                <td></td>
              </tr>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const movies = useAppSelector((state) => state.movies);
  const dispatch = useDispatch();
  const [addingMovie, setAddingMovie] = useState(false);
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

  const hideAddEditDialog = () => {
    setEditingMovie(null);
    setAddingMovie(false);
  };

  useEffect(() => {
    console.log("in home useEffect");
    if (
      !currentPageRef.current ||
      !perPageRef.current ||
      currentPageRef.current !== currentPage ||
      perPageRef.current !== perPage
    ) {
      console.log("making skip and count");
      currentPageRef.current = currentPage || 1;
      perPageRef.current = perPage || 10;

      let count = (perPage === null ? 10 : perPage) as number;
      let skip =
        (((currentPage === null ? 1 : currentPage) as number) - 1) * count;
      let segmentToReturn = (movies?.movies || []).find((segment: any) => {
        return segment.count === count && segment.skip === skip;
      });
      console.log("has segmentToReturn: " + !!segmentToReturn);
      if (!segmentToReturn) {
        // @ts-ignore
        console.log("loading data");
        loadData(skip, count);
      }
    } else {
      console.log("no api called");
    }
  }, [currentPage, perPage]);

  return (
    <>
      <div
        className={
          "header-box-like-margin flex flex-col w-100 border-box h-auto"
        }
      >
        <div className={"w-100 flex flex-col justify-start items-end"}>
          <button
            className={"btn secondary-btn mb-2"}
            onClick={() => setAddingMovie(true)}
          >
            <span className={"normal"}>Add Movie</span>
          </button>
        </div>
        <div className={"rounded-2xl overflow-hidden"}>
          <div>
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
        </div>
      </div>
      {(addingMovie || editingMovie) && (
        <EditDialog
          addingMovie={addingMovie}
          editingMovie={editingMovie}
          hideAddEditDialog={hideAddEditDialog}
        />
      )}
    </>
  );
}

import { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { WrapperHeader } from '../components/WrapperHeader';
import { MANAGE_COLUMNS } from '../constants/table';
import { Alert } from '../components/Alert';
import search from '../assets/search-chat.svg';
import remove from '../assets/delete.svg';
import chat from '../assets/chat.svg';
import useAxios from '../hooks/useAxios';

export const ManageJobseekersEmployeersTable = ({
  tableData,
  title,
  setRefetch,
}) => {
  const [toDeleteDetail, setToDeleteDetail] = useState(null);
  const [isPositive, setIsPositive] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const columns = useMemo(() => MANAGE_COLUMNS, []);
  const data = useMemo(() => tableData, []);

  const deleteData = useAxios();

  console.log(tableData);

  const {
    makeRequest,
    isLoading,
    errorMessage,
    success,
    data: gottenData,
  } = deleteData();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setGlobalFilter,
    state: { pageSize, pageIndex, globalFilter },
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    usePagination
  );

  useEffect(() => {
    if (isPositive === 'yes') {
      makeRequest({
        url:
          title === 'Manage Jobseekers'
            ? `/jobseekers/user-document-review/${toDeleteDetail.userId}`
            : `/employer/user-profile-review/${toDeleteDetail.userId}`,
        method: 'DELETE',
        payload: { id: toDeleteDetail.userId },
      });
    } else {
      setShowAlert(false);
      setToDeleteDetail(null);
      setIsPositive(null);
    }
  }, [isPositive]);

  useEffect(() => {
    if (success) setTimeout(() => setRefetch((prev) => prev + 1), 0);
  }, [success]);

  const handleDeleteConfirmation = (detail) => {
    setToDeleteDetail(detail);
    setShowAlert(true);
  };

  if (isLoading) return <LoadingIndicator />;
  if (errorMessage) return <ErrorIndicator errorMessage={errorMessage} />;

  return (
    <div className='flex flex-col bg-[#fff] rounded-[30px] pb-[44px] px-[28px] h-[100%]'>
      <div className='flex justify-between items-center'>
        <div className='ml-[-28px]'>
          <WrapperHeader title={title} />
        </div>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search'
            value={globalFilter || ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className='flex items-center text-[14px] leading-[18px] text-[#525252] bg-[#F2F2F2] rounded-[25px] h-[40px] px-[23px] w-[333px] outline-none border-none'
          />
          <img
            src={search}
            alt='search icon'
            className='absolute top-[50%] right-[23px] translate-y-[-50%]'
          />
        </div>
      </div>

      <table
        {...getTableProps()}
        className='w-[100%] min-w-[100%] max-w-[100%]'
      >
        <thead className='bg-[#C9DEFF]'>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index, arr) => (
                <th
                  {...column.getHeaderProps()}
                  className={`text-[14px] font-[600] leading-[18px] p-[12px] text-[#000] ${
                    index !== arr.length - 1
                      ? 'border-r-[1px] border-solid border-[#808080]'
                      : 'border-none'
                  } ${index ? 'text-start' : 'text-center'}`}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={`${index % 2 !== 0 ? 'bg-[#F2F2F2]' : 'bg-[#fff]'}`}
              >
                {row.cells.map((cell, index, arr) => (
                  <td
                    {...cell.getCellProps()}
                    className={`text-[14px] leading-[18px] text-[#000] p-[13px] ${
                      index ? 'text-start' : 'text-center'
                    } ${
                      cell.column.Header === 'Name'
                        ? 'min-w-[230px]'
                        : 'min-w-[0px]'
                    } ${
                      index !== arr.length - 1
                        ? 'border-r-[1px] border-solid border-[#808080]'
                        : 'border-none'
                    }`}
                  >
                    {cell.column.Header === 'Actions' && (
                      <div className='flex items-center gap-[11px] text-[10px] font-[700] leading-6'>
                        <button className='flex items-center gap-[5px] text-[#02378b]'>
                          <img src={chat} alt='chat icon' />
                          <span>chat</span>
                        </button>

                        <button
                          className='flex items-center gap-[5px] text-[#C90415]'
                          onClick={() =>
                            // handleDeleteConfirmation(cell.row.original.userId)
                            handleDeleteConfirmation(cell.row.original)
                          }
                        >
                          <img src={remove} alt='remove icon' />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}

                    {cell.column.Header === 'Email Address' && (
                      <>{cell.render('Cell')}</>
                    )}

                    {cell.column.Header === 'Phone Number' && (
                      <>{cell.render('Cell')}</>
                    )}

                    {cell.column.Header === 'Name' && (
                      <>{cell.render('Cell')}</>
                    )}

                    {cell.column.Header === 'S/N' && <>{cell.render('Cell')}</>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className='flex items-center h-[21px] mt-[auto] justify-between'>
        {/* <div className="text-[10px] leading-[13px] text-[#000]">
          Showing {pageSize * (pageIndex + 1) - 9} to{" "}
          {pageSize * (pageIndex + 1)} of {data.length} entries
        </div> */}
        <div className='text-[10px] leading-[13px] text-[#000]'>
          Showing {pageSize * (pageIndex + 1) - 9} to{' '}
          {pageSize * (pageIndex + 1) - 10 + data.length} of {data.length}{' '}
          entries
        </div>

        <div className='flex items-center h-[18px]'>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className={`text-[10px] font-[600] leading-[13px] mr-[26px] outline-none ${
              canPreviousPage
                ? 'text-[#02378B] cursor-pointer'
                : 'text-[#606060a0] cursor-not-allowed'
            }`}
          >
            Prev
          </button>

          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className={`text-[10px] font-[600] leading-[13px] ml-[20px] outline-none ${
              canNextPage
                ? 'text-[#02378B] cursor-pointer'
                : 'text-[#606060a0] cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {showAlert && (
        <div className='fixed top-[0] right-[0] bottom-[0] left-[255px] flex justify-center items-center bg-[#918a8a61]'>
          <div>
            <Alert
              title='DELETE'
              text={`Are you sure you want to delete ${
                toDeleteDetail.name.trim() ? toDeleteDetail.name : 'this user'
              }?, it can't be reversed?`}
              setIsPositive={setIsPositive}
            />
          </div>
        </div>
      )}
    </div>
  );
};

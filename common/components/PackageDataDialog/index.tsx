import { some } from '@common/constants'
import fetchThunk from '@common/fetchThunk'
import useGeneralHook from '@common/hook/useGeneralHook'
import { CloseIcon, LoadingIcon } from '@public/icons'
import { setOpenPackageDataDialog } from '@redux/dialogReducer'
import { AppState } from '@redux/store'
import { API_PATHS } from '@utility/API_PATH'
import { useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import useSWRInfinite from 'swr/infinite'
import Modal from '../Modal'

const background = [
  'linear-gradient(226.29deg, #00B6A0 -45.07%, rgba(20, 20, 20, 0) 81.24%), #171717',
  'linear-gradient(224.72deg, #F9B630 -44.13%, rgba(20, 20, 20, 0) 81.15%), #171717',
  'linear-gradient(225.92deg, #EC1B2E -45.46%, rgba(20, 20, 20, 0) 81.22%), #171717',
]

const PackageDataDialog = () => {
  const { dispatch, setMessage } = useGeneralHook()
  const [dataPackage, setDataPackage] = useState<some | undefined>(undefined)
  const [open, setOpen] = useState(false)
  const openPackageData = useSelector(
    (state: AppState) => state.dialog.openPackageData,
    shallowEqual
  )
  const {
    data = [],
    mutate,
    size,
    setSize,
    isValidating,
  } = useSWRInfinite(
    (index) =>
      openPackageData
        ? API_PATHS.users.packageData({
            page_token: index,
            page_size: 12,
          })
        : null,
    async (url) => {
      const json = await dispatch(fetchThunk({ url, method: 'get' }))
      return json?.data?.data
    },
    {
      revalidateOnFocus: false,
      revalidateFirstPage: false,
    }
  )

  const mappedData = useMemo(() => {
    return data.filter(Boolean)?.reduce((v, c) => {
      return [...v, ...c]
    }, [])
  }, [data])

  const onRegister = async (value) => {
    try {
      const json = await dispatch(
        fetchThunk(
          {
            url: API_PATHS.users.subscriber,
            method: 'post',
            data: {
              package_id: value.id,
              source: 'web',
            },
          },
          true
        )
      )
      mutate()
      setDataPackage(json.data)
      setOpen(true)
    } catch (e: any) {
      setMessage({ message: e.response?.data?.message })
    }
  }

  const onUnRegister = async (value) => {
    try {
      const json = await dispatch(
        fetchThunk(
          {
            url: API_PATHS.users.unsubscriber,
            method: 'post',
            data: {
              package_id: value.id,
              source: 'web',
            },
          },
          true
        )
      )
      mutate()
      setMessage({ message: json.data?.message })
    } catch (e: any) {
      setMessage({ message: e.response?.data?.message })
    }
  }

  return (
    <>
      <Modal
        open={openPackageData}
        onClose={() => {
          dispatch(setOpenPackageDataDialog(false))
        }}
        className="overflow-hidden"
      >
        <div className="flex max-h-[90vh] w-[960px] flex-col items-center overflow-auto pt-10 pb-14">
          <button
            className="absolute top-0 right-0 p-3"
            onClick={() => {
              dispatch(setOpenPackageDataDialog(false))
            }}
          >
            <CloseIcon />
          </button>
          <p className="mb-4 text-center font-bold title2">
            <FormattedMessage id="packageData" />
          </p>
          <p className="mb-9 text-center text-neutral-500 headline">
            <FormattedMessage id="packageDataNote" />
          </p>
          <div
            className="-ml-5 -mb-5 grid grid-cols-3 overflow-auto px-14"
            onScroll={(e) => {
              if (
                e.currentTarget.scrollLeft +
                  e.currentTarget.offsetWidth +
                  100 >=
                  e.currentTarget.scrollWidth &&
                !isValidating &&
                data.length > 0 &&
                data?.every((v) => v.length > 0)
              ) {
                setSize(size + 1)
              }
            }}
          >
            {mappedData?.map((item) => (
              <div className="ml-5 h-full pb-5" key={item.id}>
                <div
                  className=" flex h-full flex-col items-center rounded-xl py-4 px-3"
                  style={{
                    background:
                      background[
                        item.chargeRangeStr?.toLowerCase().includes('month') ||
                        item.chargeRangeStr?.toLowerCase().includes('tháng')
                          ? 2
                          : item.chargeRangeStr
                              ?.toLowerCase()
                              .includes('week') ||
                            item.chargeRangeStr?.toLowerCase().includes('tuần')
                          ? 1
                          : 0
                      ],
                  }}
                >
                  <p className="text-center font-bold title">{item.name}</p>
                  <p className="mt-1 text-center text-neutral-400 caption1">
                    {item.chargeRangeStr}
                  </p>
                  <p className="my-20 h-full text-center text-4xl font-bold">
                    {item.priceStr.split('/')[0]}
                    <p className="text-2xl font-normal">
                      /{item.priceStr.split('/')[1]}
                    </p>
                  </p>
                  <div className="mt-1 mb-2 ml-2 flex text-neutral-500 caption1">
                    •&nbsp;{item.short_description}
                  </div>
                  <div className="divider w-full" />
                  {item.status === 1 ? (
                    <div className="flex w-full justify-between pt-2">
                      <button className="rounded-xl bg-primary bg-opacity-20 py-0 px-4 font-semibold text-primary">
                        <FormattedMessage id="using" />
                      </button>
                      <button
                        className="p-2 font-bold text-neutral-300 headline"
                        onClick={() => onUnRegister(item)}
                      >
                        <FormattedMessage id="cancel" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex w-full justify-end pt-2">
                      <button
                        className="p-2 pr-0 font-bold text-primary headline"
                        onClick={() => onRegister(item)}
                      >
                        <FormattedMessage id="register" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isValidating && (
              <div className="col-span-3 flex h-[264px] items-center justify-center">
                <LoadingIcon className="h-10 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </Modal>
      <Modal open={open} onClose={setOpen}>
        <div className="w-[346px] py-6 px-8 text-center">
          <p className="font-bold title">
            <FormattedMessage id="notify" />
          </p>
          {dataPackage?.message && (
            <div
              className="mt-5 break-all headline"
              dangerouslySetInnerHTML={{ __html: dataPackage?.message }}
            />
          )}
          {dataPackage?.errorCode === '46' && (
            <div className="my-7 font-bold text-primary headline">
              {dataPackage?.command}&nbsp;{' '}
              <span className="lowercase">
                <FormattedMessage id="send" />
              </span>
              &nbsp;{dataPackage?.shortCode}
            </div>
          )}
          <button
            className="btn-container mx-auto mt-8 w-fit"
            type="button"
            onClick={() => setOpen(false)}
          >
            <FormattedMessage id="getIt" />
          </button>
        </div>
      </Modal>
    </>
  )
}
export default PackageDataDialog

import React from 'react'
import {action, makeAutoObservable, observable, runInAction} from "mobx";
import {observer} from "mobx-react";
import {backendDelete, backendGet, backendPost} from "../../utils/RequestUtils";
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner
} from "@coreui/react"
import {globalModalStore} from "../../components/AppContent";

const _ = require('lodash');

const FILTER_MODE_SIMPLE = 'SIMPLE'
const FILTER_MODE_COMPLEX = 'COMPLEX'

class DashboardStore {
  @observable items = [];
  @observable page = 1;
  @observable pageSize = 5;
  @observable orderColumn = 'id';
  @observable filter = {};
  @observable filterMode = FILTER_MODE_SIMPLE
  @observable datalistOptions = {}
  @observable pagination;
  @observable modalVisible = false;
  @observable openItem;

  constructor() {
    this.openItem = null;
    this.modalVisible = false;
    makeAutoObservable(this);
    this.search()
  }

  search = async () => {
    let page = this.page
    let pageSize = this.pageSize
    let orderColumn = this.orderColumn
    let params = {page, pageSize, orderColumn}
    let response;

    if (this.filterMode === FILTER_MODE_SIMPLE) {
      params.query = this.filter.smart
      response = await backendGet("/api/item/smart-search", {params})
    } else {
      params = Object.assign(params, this.filter)
      response = await backendGet("/api/item/search", {params})
    }

    runInAction(
      () => {
        if (response) {
          this.items = response.items
          this.pagination = response.pagination
          this.pagination.totalPages = Math.floor(response.pagination.total / pageSize) + 1
        }
      }
    )
  }

  @action
  changeFilterMode = (targetMode) => {
    if (this.filterMode === targetMode) { return }

    this.filter = {}
    this.filterMode = targetMode

  }

  tooltip = async (fieldName, currentInput) => {
    let result = await backendGet("/api/item/tooltip", {params: {fieldName, query: currentInput}})

    runInAction( () => { this.datalistOptions[fieldName] = result } )

  }

  @action
  clear = () => {
    this.filter = {}
    this.datalistOptions = {}
    this.search()
  }

  @action
  filterOnChange = (newValue, fieldName) => {
    this.filter[fieldName] = newValue

    if (this.filterMode === FILTER_MODE_COMPLEX) {
      this.tooltip(fieldName, this.filter[fieldName])
    }

  }

  changePage = async (delta) => {
    runInAction(
      () => {
        this.page = this.page + delta
        this.search()
      }
    )
  }

  showItemModal = async (itemId) => {
    runInAction(
      async () => {
        this.openItem = await backendGet('/api/item/'+itemId, {});
        this.modalVisible = true;
      }
    )
  }

  @action
  closeModal = () => {
    this.openItem = null;
    this.modalVisible = false;
  }

  save = async (item) => {
    let response = await backendPost("/api/item", item);

    runInAction(
      () => {
        this.search()
        this.modalVisible = false;
        this.openItem = null;
      }
    )
  }

  delete = async (item) => {
    let id = item.id;
    let response = await backendDelete("/api/item/"+id, {})

    runInAction(
      () => {
        this.search()
        this.modalVisible = false;
        this.openItem = null;
      }
    )

  }

  @action
  debugChange = () => {
    this.openItem.name+="1"
  }

  @action
  editItemFormOnChange = (newValue, fieldName) => {
    this.openItem[fieldName] = newValue;
    this.tooltip(fieldName, this.openItem[fieldName])
  }

  @action
  newItem = () => {
    this.openItem = {}
    this.modalVisible = true
  }

}

export const dashboardStore = new DashboardStore();

let drawDebug = () => {
  return (
    <>
      {JSON.stringify(globalModalStore)}

      <button onClick={() => {
        dashboardStore.page = 2
      }}>button</button>

      <button onClick={() => {
        dashboardStore.search()
      }}>button2</button>
    </>
  )
}

const FilterModeSelector = observer(
  () => {
    return (
      <>
        <div>
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button className={'nav-link ' + (dashboardStore.filterMode === FILTER_MODE_SIMPLE ? 'active' : '')}
                 aria-selected={dashboardStore.filterMode === FILTER_MODE_SIMPLE}
                 onClick={ (e) => { e.preventDefault(); dashboardStore.changeFilterMode(FILTER_MODE_SIMPLE) } }>
                Простой фильтр
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className={'nav-link ' + (dashboardStore.filterMode === FILTER_MODE_COMPLEX ? 'active' : '')}
                 aria-selected={dashboardStore.filterMode === FILTER_MODE_COMPLEX}
                 tabIndex="-1"
                 onClick={ (e) => { e.preventDefault(); dashboardStore.changeFilterMode(FILTER_MODE_COMPLEX) } }>
                Сложный фильтр
              </button>
            </li>

            <li className="nav-item ms-auto" role="presentation">
              <CButton color='primary' onClick={dashboardStore.newItem}>Новый экспонат</CButton>
            </li>
          </ul>
        </div>
      </>
    )
  }
)

const SearchResult = observer(
  () => {
    return (
      <>
        <table className="table table-hover">

          <thead>
            <tr>
              <th scope="col">Номер</th>
              <th scope="col">Название</th>
              <th scope="col">Дата</th>
              <th scope="col">Откуда</th>
              <th scope="col">Где</th>
              <th scope="col">Комментарии</th>
            </tr>
          </thead>

          <tbody>
            <ResultRow />
          </tbody>

        </table>
      </>
    )
  }

)

const ResultRow = observer(
  () => {
    return (
      <>
        {
          dashboardStore.items.map( (item, i) => {
            return (
              <tr role='button' key={i} onClick={ () => { dashboardStore.showItemModal(item.id) } }>
                <th scope="row">{item.invNumber}</th>
                <td>{item.name}</td>
                <td>{item.circa}</td>
                <td>{item.origin}</td>
                <td>{item.placement}</td>
                <td>{item.comment}</td>
              </tr>
            )
          } )

        }
      </>
    )
  }

)

const Card = observer(
  () => {
    return (
      <>
        <div className={'card mb-4'}>
          <div className="card-header"><strong>Экспонаты</strong></div>
          <div className="card-body">

            <FilterModeSelector />

            <div className="tab-content rounded-bottom">
              <div className="tab-pane p-2 active preview" role="tabpanel">
                { dashboardStore.filterMode === FILTER_MODE_SIMPLE ? <SimpleFilter /> : <ComplexFilter /> }
              </div>
            </div>



            <SearchResult />

            { dashboardStore.pagination ? <Pagination /> : <EmptyPagination /> }
          </div>

        </div>
      </>
    )
  }
)

const SimpleFilter = observer(
  () => {
    return (
      <>
        <form className="row gy-2 gx-3 align-items-center">

          <div className="col-auto">
            <label htmlFor="autoSizingInput">Поиск</label>
            <input className="form-control" id="filter_smart" type="text" value={dashboardStore.filter.smart ? dashboardStore.filter.smart : ''} onChange={ (e) => { dashboardStore.filterOnChange(e.target.value, 'smart') } }/>
          </div>

          <div className="col-auto">
            <button className="btn btn-primary mt-4" type="submit" onClick={(e) => {e.preventDefault(); dashboardStore.search()}}>Поиск</button>
          </div>
        </form>
      </>
    )
  }
)

const Datalist = observer(
  (props) => {
    return (
      <>
        <datalist id={"datalistOptions_"+props.fieldName}>
          {dashboardStore.datalistOptions[props.fieldName] ?
            dashboardStore.datalistOptions[props.fieldName].map(
              (itemText, i) => { return <option value={itemText} key={'datalistItem_'+props.fieldName+'_'+i} /> }
            )
            : []}
        </datalist>
      </>
    )
  }
)

const ComplexFilter = observer(
  () => {
    return (
      <>
        <form className="row gy-2 gx-3 align-items-center">

          <div className="col-auto">
            <FilterField prettyName='Номер' fieldName='invNumber' />
          </div>

          <div className="col-auto">
            <FilterField prettyName='Название' fieldName='name' />
          </div>

          <div className="col-auto">
            <FilterField prettyName='Дата' fieldName='circa' />
          </div>

          <div className="col-auto">
            <FilterField prettyName='Откуда получен' fieldName='origin' />
          </div>

          <div className="col-auto">
            <FilterField prettyName='Где находится' fieldName='placement' />
          </div>

          <div className="col-auto">
            <FilterField prettyName='Комментарии' fieldName='comment' />
          </div>

          <div className="col-auto">
            <button className="btn btn-primary mt-4" type="submit" onClick={(e) => {e.preventDefault(); dashboardStore.search()}}>Поиск</button>
          </div>

          <div className="col-auto">
            <button className="btn btn-secondary mt-4" onClick={(e) => { e.preventDefault(); dashboardStore.clear() }}>Сбросить</button>
          </div>

        </form>
      </>
    )
  }
)

const FilterField = observer(
  (props = {prettyName:'Название поля', fieldName:'stubFieldName'}) => {
    return (
      <>
        <label htmlFor="autoSizingInput">{props.prettyName}</label>
        <input className="form-control"
               id={'filter_'+props.fieldName}
               type="text"
               value={dashboardStore.filter[props.fieldName] ? dashboardStore.filter[props.fieldName] : ''}
               list={'datalistOptions_'+props.fieldName}
               onChange={ (e) => { dashboardStore.filterOnChange(e.target.value, props.fieldName) }}/>

        <Datalist fieldName={props.fieldName}/>
      </>
    )
  }
)

const ModalTooltipField = observer(
  (props = {prettyName:'Название поля', fieldName:'stubFieldName'}) => {
    return (
      <>
        <CFormLabel htmlFor={"openItemModal_form_"+props.fieldName}>{props.prettyName}</CFormLabel>
        <CFormInput type="text"
                    id={"openItemModal_form_"+props.fieldName}
                    placeholder={props.prettyName}
                    value={_.get(dashboardStore, "openItem."+props.fieldName)}
                    list={'datalistOptions_'+props.fieldName}
                    onChange={ (e) => {dashboardStore.editItemFormOnChange(e.target.value, props.fieldName)} }/>

        <Datalist fieldName={props.fieldName}/>
      </>
    )
  }
)

const Pagination = observer(
  () => {
    return (
      <>
        <nav aria-label="...">
          <ul className="pagination">
            <li className={"page-item " + (dashboardStore.page === 1 ? 'disabled' : '')}>
              <button className="page-link" onClick={ () => {changePageOnClick(-1); } }>Предыдущая</button>
            </li>

            {dashboardStore.page - 2 > 0 ?
              <li className="page-item disabled"><button className="page-link">...</button></li> : null}

            {dashboardStore.page - 1 > 0 ?
              <li className="page-item" aria-current="page"><button className="page-link" onClick={ () => {changePageOnClick(-1); } }>{dashboardStore.page-1}</button></li> : null}

            <li className="page-item active" aria-current="page"><button className="page-link">{dashboardStore.page}</button></li>

            {dashboardStore.page < dashboardStore.pagination.totalPages ?
              <li className="page-item" aria-current="page"><button className="page-link" onClick={ () => {changePageOnClick(+1); } }>{dashboardStore.page+1}</button></li> : null}

            {dashboardStore.pagination.totalPages - dashboardStore.page >= 2 ?
              <li className="page-item disabled"><button className="page-link">...</button></li> : null}

            <li className={"page-item " + (dashboardStore.page === dashboardStore.pagination.totalPages ? 'disabled' : '')}>
              <button className="page-link" onClick={ () => {changePageOnClick(1); } }>Следующая</button>
            </li>

            <li className="page-item disabled ms-auto">
              {'Всего: ' + dashboardStore.pagination.total}
            </li>
          </ul>
        </nav>
      </>
    )
  }
)

let changePageOnClick = (delta) => {
  document.activeElement.blur();
  dashboardStore.changePage(delta);
}

const EmptyPagination = observer(
  () => {
    return (
      <>
        <nav aria-label="...">
          <ul className="pagination">
            <li className="page-item disabled">
              <button className="page-link">Предыдущая</button>
            </li>

            <li className="page-item active"><button className="page-link">1</button></li>

            <li className="page-item disabled">
              <button className="page-link">Следующая</button>
            </li>
          </ul>
        </nav>
      </>
    )
  }
)

const Modal = observer(
  () => {
    return (
      <>
        <CModal visible={dashboardStore.modalVisible} onClose={dashboardStore.closeModal} size='lg'>
          <CModalHeader>
            <CModalTitle>{_.get(dashboardStore, "openItem.id") != null ? _.get(dashboardStore, "openItem.invNumber") + " " + _.get(dashboardStore, "openItem.name") : 'Новый экспонат'}</CModalTitle>
          </CModalHeader>

          <CModalBody>
            {dashboardStore.openItem ? <ModalForm /> : <CSpinner />}
          </CModalBody>

          <CModalFooter>
            <CButton color="secondary" onClick={dashboardStore.closeModal}>Закрыть</CButton>
            <CButton color="danger" onClick={() => {dashboardStore.delete(dashboardStore.openItem)}} disabled={!_.get(dashboardStore, 'openItem.id')}>Удалить</CButton>
            <CButton color="primary" onClick={() => {dashboardStore.save(dashboardStore.openItem)}} disabled={!_.get(dashboardStore, 'openItem.name')}>Сохранить</CButton>
          </CModalFooter>
        </CModal>
      </>
    )
  }
)

const ModalForm = observer(
  () => {
    return (
      <>
        <CForm>
          <CRow>
            <CCol>
              <div className="mb-3">
                <CFormLabel htmlFor="openItemModal_form_name">Название</CFormLabel>
                <CFormInput type="text"
                            id="openItemModal_form_name"
                            placeholder="Название"
                            value={_.get(dashboardStore, "openItem.name")}
                            onChange={ (e) => {dashboardStore.editItemFormOnChange(e.target.value, 'name')} }/>
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol>
              <div className="mb-3">
                <CFormLabel htmlFor="openItemModal_form_invNumber">Инвентарный номер</CFormLabel>
                <CFormInput type="text"
                            id="openItemModal_form_invNumber"
                            placeholder="Инвентарный номер"
                            value={_.get(dashboardStore, "openItem.invNumber")}
                            onChange={ (e) => {dashboardStore.editItemFormOnChange(e.target.value, 'invNumber')} }/>
              </div>
            </CCol>

            <CCol>
              <div className="mb-3">
                <ModalTooltipField prettyName='Где лежит' fieldName='placement'/>
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol>
              <div className="mb-3">
                <ModalTooltipField prettyName='Откуда получен' fieldName='origin'/>
              </div>
            </CCol>

            <CCol>
              <div className="mb-3">
                <CFormLabel htmlFor="openItemModal_form_circa">Год выпуска</CFormLabel>
                <CFormInput type="text"
                            id="openItemModal_form_circa"
                            placeholder="Год выпуска"
                            value={_.get(dashboardStore, "openItem.circa")}
                            onChange={ (e) => {dashboardStore.editItemFormOnChange(e.target.value, 'circa')} }/>
              </div>
            </CCol>
          </CRow>

          <CRow>
            <CCol>
              <div className="mb-3">
                <CFormLabel htmlFor="openItemModal_form_comment">Комментарии</CFormLabel>
                <CFormTextarea type="text"
                            id="openItemModal_form_comment"
                            placeholder="Комментарии"
                            value={_.get(dashboardStore, "openItem.comment")}
                            rows={3}
                            onChange={ (e) => {dashboardStore.editItemFormOnChange(e.target.value, 'comment')} }/>
              </div>
            </CCol>
          </CRow>
        </CForm>
      </>
    )
  }
)

export default observer(() => {
  return (
    <>
      {/*{drawDebug()}*/}
      <Modal />
      <Card/>
    </>
  )
});


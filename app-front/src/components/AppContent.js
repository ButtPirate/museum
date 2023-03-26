import React, {Suspense} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {CButton, CContainer, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CSpinner} from '@coreui/react'
import {action, makeAutoObservable, observable} from "mobx";
import {observer} from "mobx-react";

// routes config
import routes from '../routes'

class GlobalModalStore {
  @observable modalVisible;
  @observable error;

  constructor() {
    makeAutoObservable(this)
    this.modalVisible = false;
  }

  @action
  showModal = () => {
    this.modalVisible = true;
  }

  @action
  hideModal = () => {
    this.modalVisible = false;
    this.error = null;
  }

  @action
  showError = (error) => {
    this.error = error;
    this.modalVisible = true;
  }
}

export const globalModalStore = new GlobalModalStore();

const GlobalModal = observer(
  () => {
    return (
      <>
        <CModal visible={globalModalStore.modalVisible} onClick={globalModalStore.hideModal} size='lg' fullscreen={true}>
          <CModalHeader>
            <CModalTitle>Ошибка</CModalTitle>
          </CModalHeader>

          <CModalBody>
            {JSON.stringify(globalModalStore.error)}
          </CModalBody>

          <CModalFooter>
            <CButton color="primary" onClick={globalModalStore.hideModal}>Упс</CButton>
          </CModalFooter>
        </CModal>
      </>
    )
  }
)

const AppContent = observer(
  () => {
    return (
      <CContainer lg>

        <GlobalModal />

        <Suspense fallback={<CSpinner color="primary" />}>
          <Switch>
            {routes.map((route, idx) => {
              return (
                route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => (
                      <>
                        <route.component {...props} />
                      </>
                    )}
                  />
                )
              )
            })}
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Suspense>
      </CContainer>
    )
  }

)

export default React.memo(AppContent);
export { AppContent };

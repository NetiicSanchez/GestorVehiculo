'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">gestor-vehiculos documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AgregarVehiculoComponent.html" data-type="entity-link" >AgregarVehiculoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AgregarVehiculoSimpleComponent.html" data-type="entity-link" >AgregarVehiculoSimpleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/App.html" data-type="entity-link" >App</a>
                            </li>
                            <li class="link">
                                <a href="components/BitacoraComponent.html" data-type="entity-link" >BitacoraComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CombustibleComponent.html" data-type="entity-link" >CombustibleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardComponent.html" data-type="entity-link" >DashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardGastos.html" data-type="entity-link" >DashboardGastos</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardGastosComponent.html" data-type="entity-link" >DashboardGastosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DetalleVehiculoComponent.html" data-type="entity-link" >DetalleVehiculoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DialogoNuevaCargaComponent.html" data-type="entity-link" >DialogoNuevaCargaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditarVehiculoComponent.html" data-type="entity-link" >EditarVehiculoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EstadosVehiculosComponent.html" data-type="entity-link" >EstadosVehiculosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GastosAdicionalComponent.html" data-type="entity-link" >GastosAdicionalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GraficasCombustibleComponent.html" data-type="entity-link" >GraficasCombustibleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GraficasGastos.html" data-type="entity-link" >GraficasGastos</a>
                            </li>
                            <li class="link">
                                <a href="components/GruposVehiculosComponent.html" data-type="entity-link" >GruposVehiculosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InventarioComponent.html" data-type="entity-link" >InventarioComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PerfilComponent.html" data-type="entity-link" >PerfilComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RegisterComponent.html" data-type="entity-link" >RegisterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TiposVehiculosComponent.html" data-type="entity-link" >TiposVehiculosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UsuariosListComponent.html" data-type="entity-link" >UsuariosListComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BitacoraService.html" data-type="entity-link" >BitacoraService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CatalogosService.html" data-type="entity-link" >CatalogosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CombustibleService.html" data-type="entity-link" >CombustibleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CombustiblesService.html" data-type="entity-link" >CombustiblesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DashboardService.html" data-type="entity-link" >DashboardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GastosAdicionalService.html" data-type="entity-link" >GastosAdicionalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsuariosService.html" data-type="entity-link" >UsuariosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VehiculosService.html" data-type="entity-link" >VehiculosService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CargaCombustible.html" data-type="entity-link" >CargaCombustible</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EstadoVehiculo.html" data-type="entity-link" >EstadoVehiculo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GastoAdicional.html" data-type="entity-link" >GastoAdicional</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GastoVehiculo.html" data-type="entity-link" >GastoVehiculo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GrupoVehiculo.html" data-type="entity-link" >GrupoVehiculo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResumenDashboard.html" data-type="entity-link" >ResumenDashboard</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TipoCombustible.html" data-type="entity-link" >TipoCombustible</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TipoVehiculo.html" data-type="entity-link" >TipoVehiculo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Vehiculo.html" data-type="entity-link" >Vehiculo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VehiculoDashboard.html" data-type="entity-link" >VehiculoDashboard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
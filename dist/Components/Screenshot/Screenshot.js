/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "dojo/i18n!./Screenshot/nls/resources", "esri/widgets/Widget", "esri/core/accessorSupport/decorators", "esri/core/watchUtils", "esri/core/Handles", "esri/widgets/support/widget", "./Screenshot/ScreenshotViewModel", "esri/widgets/Feature"], function (require, exports, __extends, __decorate, i18n, Widget, decorators_1, watchUtils, Handles, widget_1, ScreenshotViewModel, FeatureWidget) {
    "use strict";
    //----------------------------------
    //
    //  CSS Classes
    //
    //----------------------------------
    var CSS = {
        base: "esri-screenshot",
        widget: "esri-widget",
        screenshotBtn: "esri-screenshot__btn",
        mainContainer: "esri-screenshot__main-container",
        panelTitle: "esri-screenshot__panel-title",
        panelSubTitle: "esri-screenshot__panel-subtitle",
        screenshotOption: "esri-screenshot__screenshot-option",
        buttonContainer: "esri-screenshot__screenshot-button-container",
        hide: "esri-screenshot--hide",
        screenshotCursor: "esri-screenshot__cursor",
        maskDiv: "esri-screenshot__mask-div",
        actionBtn: "esri-screenshot__action-btn",
        screenshotImg: "esri-screenshot__js-screenshot-image",
        screenshotDiv: "esri-screenshot__screenshot-div",
        screenshotImgContainer: "esri-screenshot__screenshot-img-container",
        downloadBtn: "esri-screenshot__download-btn",
        backBtn: "esri-screenshot__back-btn",
        showOverlay: "esri-screenshot--show-overlay",
        hideOverlay: "esri-screenshot--hide-overlay",
        mediaIcon: "icon-ui-media",
        pointerCursor: "esri-screenshot--pointer",
        disabledCursor: "esri-screenshot--disabled",
        tooltip: "tooltip",
        tooltipRight: "tooltip-right",
        modifierClass: "modifier-class",
        closeIcon: "icon-ui-close",
        fieldsetCheckbox: "fieldset-checkbox",
        button: "btn",
        buttonRed: "btn-red",
        alert: "alert",
        greenAlert: "alert-green",
        alertClose: "alert-close",
        popupAlert: "esri-screenshot__popup-alert",
        screenshotfieldSetCheckbox: "esri-screenshot__field-set-checkbox"
    };
    var Screenshot = /** @class */ (function (_super) {
        __extends(Screenshot, _super);
        //----------------------------------
        //
        //  Lifecycle Methods
        //
        //----------------------------------
        function Screenshot(value) {
            var _this = _super.call(this) || this;
            //----------------------------------
            //
            //  Variables
            //
            //----------------------------------
            // Stored Nodes
            _this._maskNode = null;
            _this._screenshotImgNode = null;
            _this._downloadBtnNode = null;
            _this._activeScreenshotBtnNode = null;
            _this._selectFeatureAlertIsVisible = null;
            _this._offscreenPopupContainer = null;
            _this._offscreenLegendContainer = null;
            // _popupIsIncluded
            _this._popupIsIncluded = null;
            // _handles
            _this._handles = new Handles();
            //----------------------------------
            //
            //  Properties
            //
            //----------------------------------
            // view
            _this.view = null;
            // mapComponentSelectors
            _this.mapComponentSelectors = [];
            // iconClass
            _this.iconClass = CSS.mediaIcon;
            // label
            _this.label = i18n.widgetLabel;
            // legendScreenshotEnabled
            _this.legendScreenshotEnabled = null;
            // popupScreenshotEnabled
            _this.popupScreenshotEnabled = null;
            // legendIncludedInScreenshot
            _this.legendIncludedInScreenshot = null;
            // popupIncludedInScreenshot
            _this.popupIncludedInScreenshot = null;
            _this.featureWidget = new FeatureWidget();
            _this.expandWidget = null;
            _this.legendWidget = null;
            // viewModel
            _this.viewModel = new ScreenshotViewModel();
            return _this;
        }
        Screenshot.prototype.postInitialize = function () {
            var _this = this;
            this.own([
                this._watchMapComponentSelectors(),
                this._watchPopups(),
                watchUtils.when(this, "featureWidget", function () {
                    _this.own([
                        watchUtils.whenTrue(_this, "popupScreenshotEnabled", function () {
                            if (_this.popupScreenshotEnabled && _this.popupIncludedInScreenshot) {
                                _this.own([
                                    watchUtils.init(_this, "featureWidget.graphic", function () {
                                        if (!_this.featureWidget.graphic) {
                                            _this._selectFeatureAlertIsVisible = true;
                                        }
                                        else {
                                            _this._selectFeatureAlertIsVisible = false;
                                        }
                                    })
                                ]);
                            }
                            else {
                                _this._selectFeatureAlertIsVisible = false;
                            }
                            _this.scheduleRender();
                        })
                    ]);
                }),
                watchUtils.whenTrueOnce(this, "popupScreenshotEnabled", function () {
                    _this._selectFeatureAlertIsVisible = true;
                }),
                watchUtils.watch(this, "view.popup.visible", function () {
                    if (!_this.view) {
                        return;
                    }
                    if (_this.view.popup.visible && _this._offscreenPopupContainer) {
                        if (!_this.featureWidget.container) {
                            _this.featureWidget.container = _this._offscreenPopupContainer;
                        }
                        _this.featureWidget.graphic = _this.view.popup.selectedFeature;
                    }
                })
                // watchUtils.init(this, "legendWidget", () => {})
            ]);
            this._handleExpandWidget();
        };
        Screenshot.prototype.render = function () {
            var screenshotModeIsActive = this.viewModel.screenshotModeIsActive;
            var screenshotPreviewOverlay = this._renderScreenshotPreviewOverlay();
            var maskNode = this._renderMaskNode(screenshotModeIsActive);
            if (this.legendWidget && !this.legendWidget.container) {
                this.legendWidget.container = this._offscreenLegendContainer;
            }
            return (widget_1.tsx("div", { class: this.classes(CSS.widget, CSS.base) },
                screenshotModeIsActive ? (widget_1.tsx("button", { bind: this, tabIndex: 0, class: this.classes(CSS.screenshotBtn, CSS.pointerCursor, CSS.button, CSS.buttonRed), onclick: this._deactivateScreenshot, onkeydown: this._deactivateScreenshot, title: i18n.deactivateScreenshot },
                    widget_1.tsx("span", { class: CSS.closeIcon }))) : (this._renderScreenshotPanel()),
                screenshotPreviewOverlay,
                maskNode,
                widget_1.tsx("div", { bind: this, afterCreate: widget_1.storeNode, "data-node-ref": "_offscreenPopupContainer", class: "esri-screenshot__offscreen-pop-up-container" }),
                widget_1.tsx("div", { bind: this, afterCreate: widget_1.storeNode, "data-node-ref": "_offscreenLegendContainer", class: "esri-screenshot__offscreen-legend-container" })));
        };
        Screenshot.prototype.destroy = function () {
            this._handles.removeAll();
            this._handles.destroy();
            this._handles = null;
            this._maskNode = null;
            this._screenshotImgNode = null;
        };
        //----------------------------------
        //
        //  Public Methods
        //
        //----------------------------------
        // activateScreenshot
        Screenshot.prototype.activateScreenshot = function () {
            var _this = this;
            if (this.viewModel.screenshotModeIsActive) {
                return;
            }
            this.viewModel.screenshotModeIsActive = true;
            this.view.container.classList.add(CSS.screenshotCursor);
            this.viewModel.dragHandler = this.view.on("drag", function (event) {
                _this.viewModel.setScreenshotArea(event, _this._maskNode, _this._screenshotImgNode, _this.viewModel.dragHandler, _this._downloadBtnNode);
            });
            this.scheduleRender();
        };
        // downloadImage
        Screenshot.prototype._downloadImage = function () {
            this.viewModel.downloadImage();
        };
        //----------------------------------
        //
        //  Private Methods
        //
        //----------------------------------
        //----------------------------------
        //
        //  Render Node Methods
        //
        //----------------------------------
        // _renderScreenshotPreviewBtns
        Screenshot.prototype._renderScreenshotPreviewBtns = function () {
            return (widget_1.tsx("div", null,
                widget_1.tsx("button", { bind: this, tabIndex: 0, class: CSS.actionBtn, onclick: this._downloadImage, onkeydown: this._downloadImage, afterCreate: widget_1.storeNode, "data-node-ref": "_downloadBtnNode", "aria-label": i18n.downloadImage, title: i18n.downloadImage }, i18n.downloadImage),
                widget_1.tsx("button", { bind: this, tabIndex: 0, class: this.classes(CSS.actionBtn, CSS.backBtn), onclick: this._closePreview, onkeydown: this._closePreview }, i18n.backButton)));
        };
        // _renderScreenshotPreviewOverlay
        Screenshot.prototype._renderScreenshotPreviewOverlay = function () {
            var _a;
            var previewIsVisible = this.viewModel.previewIsVisible;
            var overlayIsVisible = (_a = {},
                _a[CSS.showOverlay] = previewIsVisible,
                _a[CSS.hideOverlay] = !previewIsVisible,
                _a);
            var screenshotPreviewBtns = this._renderScreenshotPreviewBtns();
            return (widget_1.tsx("div", { class: this.classes(CSS.screenshotDiv, overlayIsVisible) },
                widget_1.tsx("div", { class: CSS.screenshotImgContainer },
                    widget_1.tsx("div", null,
                        widget_1.tsx("img", { bind: this, afterCreate: widget_1.storeNode, "data-node-ref": "_screenshotImgNode", class: CSS.screenshotImg }),
                        screenshotPreviewBtns))));
        };
        // _renderScreenshotPanel
        Screenshot.prototype._renderScreenshotPanel = function () {
            var _a;
            var screenshotTitle = i18n.screenshotTitle, screenshotSubtitle = i18n.screenshotSubtitle, setScreenshotArea = i18n.setScreenshotArea, selectAFeature = i18n.selectAFeature, legend = i18n.legend, popup = i18n.popup;
            var alertIsActive = (_a = {},
                _a["is-active"] = this._selectFeatureAlertIsVisible,
                _a);
            return (
            // screenshotBtn
            widget_1.tsx("div", { key: "screenshot-panel", class: CSS.base },
                this._selectFeatureAlertIsVisible ? (widget_1.tsx("div", { key: "feature-alert", class: this.classes(CSS.popupAlert, CSS.alert, CSS.greenAlert, CSS.modifierClass, alertIsActive) },
                    i18n.selectAFeature,
                    widget_1.tsx("button", { bind: this, onclick: this._removeSelectFeatureAlert, onkeydown: this._removeSelectFeatureAlert, class: CSS.alertClose },
                        widget_1.tsx("span", { class: CSS.closeIcon })))) : null,
                widget_1.tsx("div", { class: CSS.mainContainer },
                    widget_1.tsx("h1", { class: CSS.panelTitle }, screenshotTitle),
                    this.legendIncludedInScreenshot || this.popupIncludedInScreenshot ? (widget_1.tsx("h3", { class: CSS.panelSubTitle }, screenshotSubtitle)) : null,
                    this.legendIncludedInScreenshot || this.popupIncludedInScreenshot ? (widget_1.tsx("fieldset", { class: this.classes(CSS.fieldsetCheckbox, CSS.screenshotfieldSetCheckbox) },
                        this.legendIncludedInScreenshot ? (widget_1.tsx("label", { class: CSS.screenshotOption },
                            " ",
                            widget_1.tsx("input", { bind: this, onclick: this._toggleLegend, onkeydown: this._toggleLegend, checked: this.legendScreenshotEnabled, type: "checkbox" }),
                            legend)) : null,
                        this.popupIncludedInScreenshot ? (widget_1.tsx("label", { class: CSS.screenshotOption },
                            widget_1.tsx("input", { bind: this, onclick: this._togglePopup, onkeydown: this._togglePopup, type: "checkbox", checked: this.popupScreenshotEnabled }),
                            popup)) : null)) : null,
                    widget_1.tsx("div", { class: CSS.buttonContainer },
                        widget_1.tsx("button", { bind: this, tabIndex: 0, onclick: this.activateScreenshot, onkeydown: this.activateScreenshot, afterCreate: widget_1.storeNode, "data-node-ref": "_activeScreenshotBtnNode", disabled: this.popupIncludedInScreenshot && this.popupScreenshotEnabled
                                ? this.featureWidget && this.featureWidget.graphic
                                    ? false
                                    : true
                                : false, class: CSS.button }, setScreenshotArea)))));
        };
        // _renderMaskNode
        Screenshot.prototype._renderMaskNode = function (screenshotModeIsActive) {
            var _a;
            var maskDivIsHidden = (_a = {},
                _a[CSS.hide] = !screenshotModeIsActive,
                _a);
            return (widget_1.tsx("div", { bind: this, class: this.classes(CSS.maskDiv, maskDivIsHidden), afterCreate: widget_1.storeNode, "data-node-ref": "_maskNode" }));
        };
        // End of render node methods
        // _watchMapComponentSelectors
        Screenshot.prototype._watchMapComponentSelectors = function () {
            var _this = this;
            return watchUtils.init(this, "mapComponentSelectors", function () {
                if (_this.mapComponentSelectors === null) {
                    _this.mapComponentSelectors = [];
                }
                if (_this.mapComponentSelectors.length === 0) {
                    return;
                }
                _this.mapComponentSelectors.forEach(function (componentSelector) {
                    if (componentSelector.indexOf("popup") !== -1) {
                        _this._popupIsIncluded = true;
                        _this.scheduleRender();
                    }
                });
            });
        };
        // _watchPopups
        Screenshot.prototype._watchPopups = function () {
            var _this = this;
            return watchUtils.init(this, "view.popup.visible", function () {
                if (_this._popupIsIncluded &&
                    !_this.view.popup.visible &&
                    _this.viewModel.dragHandler) {
                    _this.viewModel.screenshotModeIsActive = false;
                    _this.view.container.classList.remove(CSS.screenshotCursor);
                    _this.scheduleRender();
                }
            });
        };
        // _deactivateScreenshot
        Screenshot.prototype._deactivateScreenshot = function () {
            var _this = this;
            this.viewModel.screenshotModeIsActive = false;
            this.view.container.classList.remove(CSS.screenshotCursor);
            if (this.featureWidget && this.featureWidget.graphic) {
                this.featureWidget.graphic = null;
            }
            if (this.viewModel.dragHandler) {
                this.viewModel.dragHandler.remove();
                this.viewModel.dragHandler = null;
            }
            window.setTimeout(function () {
                _this._activeScreenshotBtnNode.focus();
            }, 10);
            this.scheduleRender();
        };
        // _toggleLegend
        Screenshot.prototype._toggleLegend = function (event) {
            var node = event.currentTarget;
            this.legendScreenshotEnabled = node.checked;
            this.scheduleRender();
        };
        // _togglePopup
        Screenshot.prototype._togglePopup = function (event) {
            var node = event.currentTarget;
            this.popupScreenshotEnabled = node.checked;
            this.scheduleRender();
        };
        // _closePreview
        Screenshot.prototype._closePreview = function () {
            var _this = this;
            var viewModel = this.viewModel;
            viewModel.previewIsVisible = false;
            viewModel.screenshotModeIsActive = false;
            this.view.popup.clear();
            window.setTimeout(function () {
                _this._activeScreenshotBtnNode.focus();
            }, 10);
            this.scheduleRender();
        };
        // _handleExpandWidget
        Screenshot.prototype._handleExpandWidget = function () {
            var _this = this;
            var expandWidgetKey = "expand-widget";
            this._handles.remove(expandWidgetKey);
            this._handles.add(watchUtils.when(this, "expandWidget", function () {
                if (_this.expandWidget) {
                    var screenshotModeIsActiveKey = "screenshot-active";
                    _this._handles.remove(screenshotModeIsActiveKey);
                    _this._handles.add(watchUtils.whenTrue(_this, "viewModel.screenshotModeIsActive", function () {
                        var expandedKey = "expanded";
                        _this._handles.remove(expandedKey);
                        _this._handles.add(watchUtils.whenFalse(_this, "expandWidget.expanded", function () {
                            _this.viewModel.screenshotModeIsActive = false;
                            _this.view.container.classList.remove(CSS.screenshotCursor);
                            if (_this.featureWidget && _this.featureWidget.graphic) {
                                _this.featureWidget.graphic = null;
                            }
                            if (_this.viewModel.dragHandler) {
                                _this.viewModel.dragHandler.remove();
                                _this.viewModel.dragHandler = null;
                            }
                            if (_this.expandWidget) {
                                _this.expandWidget.expanded = false;
                            }
                            _this.scheduleRender();
                        }), expandedKey);
                    }), screenshotModeIsActiveKey);
                }
            }), expandWidgetKey);
        };
        // _removeSelectFeatureAlert
        Screenshot.prototype._removeSelectFeatureAlert = function () {
            this._selectFeatureAlertIsVisible = false;
            this.scheduleRender();
        };
        __decorate([
            decorators_1.aliasOf("viewModel.view"),
            decorators_1.property()
        ], Screenshot.prototype, "view", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.mapComponentSelectors"),
            decorators_1.property()
        ], Screenshot.prototype, "mapComponentSelectors", void 0);
        __decorate([
            decorators_1.property()
        ], Screenshot.prototype, "iconClass", void 0);
        __decorate([
            decorators_1.property()
        ], Screenshot.prototype, "label", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.legendScreenshotEnabled"),
            decorators_1.property()
        ], Screenshot.prototype, "legendScreenshotEnabled", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.popupScreenshotEnabled"),
            decorators_1.property()
        ], Screenshot.prototype, "popupScreenshotEnabled", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.legendIncludedInScreenshot"),
            decorators_1.property()
        ], Screenshot.prototype, "legendIncludedInScreenshot", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.popupIncludedInScreenshot"),
            decorators_1.property()
        ], Screenshot.prototype, "popupIncludedInScreenshot", void 0);
        __decorate([
            decorators_1.property()
        ], Screenshot.prototype, "featureWidget", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.expandWidget"),
            decorators_1.property()
        ], Screenshot.prototype, "expandWidget", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.legendWidget"),
            decorators_1.property()
        ], Screenshot.prototype, "legendWidget", void 0);
        __decorate([
            decorators_1.property(),
            widget_1.renderable(["viewModel.state"])
        ], Screenshot.prototype, "viewModel", void 0);
        __decorate([
            widget_1.accessibleHandler()
        ], Screenshot.prototype, "activateScreenshot", null);
        __decorate([
            widget_1.accessibleHandler()
        ], Screenshot.prototype, "_downloadImage", null);
        __decorate([
            widget_1.accessibleHandler()
        ], Screenshot.prototype, "_deactivateScreenshot", null);
        __decorate([
            widget_1.accessibleHandler()
        ], Screenshot.prototype, "_toggleLegend", null);
        __decorate([
            widget_1.accessibleHandler()
        ], Screenshot.prototype, "_togglePopup", null);
        __decorate([
            widget_1.accessibleHandler()
        ], Screenshot.prototype, "_closePreview", null);
        __decorate([
            widget_1.accessibleHandler()
        ], Screenshot.prototype, "_removeSelectFeatureAlert", null);
        Screenshot = __decorate([
            decorators_1.subclass("Screenshot")
        ], Screenshot);
        return Screenshot;
    }(decorators_1.declared(Widget)));
    return Screenshot;
});
//# sourceMappingURL=Screenshot.js.map
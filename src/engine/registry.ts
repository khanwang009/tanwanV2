import React, { lazy, Suspense } from 'react';
import { TemplateConfig, RendererProps } from './types';
import { templateRegistry } from '../data';

// Lazily load renderers to keep things clean.
const TaskJudgerRenderer = lazy(() => import('./renderers/TaskJudgerRenderer'));
const UnitGuardianRenderer = lazy(() => import('./renderers/UnitGuardianRenderer'));
const ConversionChargerRenderer = lazy(() => import('./renderers/ConversionChargerRenderer'));
const ViewBuilderRenderer = lazy(() => import('./renderers/ViewBuilderRenderer'));
const FactorRadarRenderer = lazy(() => import('./renderers/FactorRadarRenderer'));
const CommonFactorStationRenderer = lazy(() => import('./renderers/CommonFactorStationRenderer'));
const NetFoldingHouseRenderer = lazy(() => import('./renderers/NetFoldingHouseRenderer'));
const PackagingWorkshopRenderer = lazy(() => import('./renderers/PackagingWorkshopRenderer'));
const CubeLabRenderer = lazy(() => import('./renderers/CubeLabRenderer'));
const ContainerLabRenderer = lazy(() => import('./renderers/ContainerLabRenderer'));
const FractionFactoryRenderer = lazy(() => import('./renderers/FractionFactoryRenderer'));
const FractionBridgeRenderer = lazy(() => import('./renderers/FractionBridgeRenderer'));
const FractionKitchenRenderer = lazy(() => import('./renderers/FractionKitchenRenderer'));
const RotationStudioRenderer = lazy(() => import('./renderers/RotationStudioRenderer'));
const DataDetectiveRenderer = lazy(() => import('./renderers/DataDetectiveRenderer'));
const BalanceLabRenderer = lazy(() => import('./renderers/BalanceLabRenderer'));

export class EngineRegistry {
  private templates: Map<string, TemplateConfig> = new Map();
  private renderers: Map<string, React.FC<RendererProps>> = new Map();

  constructor() {
    templateRegistry.forEach(t => this.templates.set(t.id, t));
    
    // Register implemented renderers
    this.renderers.set('tpl_01', TaskJudgerRenderer);
    this.renderers.set('tpl_02', UnitGuardianRenderer);
    this.renderers.set('tpl_03', ConversionChargerRenderer);
    this.renderers.set('tpl_04', ViewBuilderRenderer);
    this.renderers.set('tpl_05', FactorRadarRenderer);
    this.renderers.set('tpl_06', CommonFactorStationRenderer);
    this.renderers.set('tpl_07', NetFoldingHouseRenderer);
    this.renderers.set('tpl_08', PackagingWorkshopRenderer);
    this.renderers.set('tpl_09', CubeLabRenderer);
    this.renderers.set('tpl_10', ContainerLabRenderer);
    this.renderers.set('tpl_11', FractionFactoryRenderer);
    this.renderers.set('tpl_12', FractionBridgeRenderer);
    this.renderers.set('tpl_13', FractionKitchenRenderer);
    this.renderers.set('tpl_14', RotationStudioRenderer);
    this.renderers.set('tpl_15', DataDetectiveRenderer);
    this.renderers.set('tpl_16', BalanceLabRenderer);
  }

  getTemplate(id: string): TemplateConfig | undefined {
    return this.templates.get(id);
  }

  getRenderer(templateId: string): React.FC<RendererProps> | null {
    return this.renderers.get(templateId) || null;
  }
}

export const engineRegistry = new EngineRegistry();

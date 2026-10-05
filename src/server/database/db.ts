import fs from 'fs';
import path from 'path';
import { DatabaseSchema, User, Product, Order, Review, BlogPost, Coupon, ContactMessage, NewsletterSubscriber, CmsPage, AuditLog, StoreSettings, VehicleMake, VehicleModel, VehicleYear, VehicleVariant, MaterialOption } from './types.ts';
import { initialSeedData } from './seed.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'database.json');

class Database {
  private data: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        // Merge with initialSeedData to ensure any missing fields/tables are present
        return {
          ...initialSeedData,
          ...parsed,
          settings: { ...initialSeedData.settings, ...(parsed.settings || {}) }
        };
      }
    } catch (err) {
      console.error('Failed to load database file, using seed data:', err);
    }

    // Initialize with seed data and save immediately
    this.persistSync(initialSeedData);
    return JSON.parse(JSON.stringify(initialSeedData));
  }

  private persistSync(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  public save() {
    // Debounce save to avoid thrashing disk
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.persistSync(this.data);
    }, 150);
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  // --- Users ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.users[idx];
  }

  // --- Vehicles ---
  public getMakes(): VehicleMake[] {
    return this.data.makes;
  }

  public addMake(make: VehicleMake): VehicleMake {
    this.data.makes.push(make);
    this.save();
    return make;
  }

  public updateMake(id: string, updates: Partial<VehicleMake>): VehicleMake | null {
    const idx = this.data.makes.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.makes[idx] = { ...this.data.makes[idx], ...updates };
    this.save();
    return this.data.makes[idx];
  }

  public deleteMake(id: string): boolean {
    const initialLen = this.data.makes.length;
    this.data.makes = this.data.makes.filter(m => m.id !== id);
    this.data.models = this.data.models.filter(m => m.makeId !== id);
    this.save();
    return this.data.makes.length < initialLen;
  }

  public getModels(makeId?: string): VehicleModel[] {
    if (makeId) {
      return this.data.models.filter(m => m.makeId === makeId);
    }
    return this.data.models;
  }

  public addModel(model: VehicleModel): VehicleModel {
    this.data.models.push(model);
    this.save();
    return model;
  }

  public updateModel(id: string, updates: Partial<VehicleModel>): VehicleModel | null {
    const idx = this.data.models.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.models[idx] = { ...this.data.models[idx], ...updates };
    this.save();
    return this.data.models[idx];
  }

  public deleteModel(id: string): boolean {
    const initialLen = this.data.models.length;
    this.data.models = this.data.models.filter(m => m.id !== id);
    this.data.years = this.data.years.filter(y => y.modelId !== id);
    this.data.variants = this.data.variants.filter(v => v.modelId !== id);
    this.save();
    return this.data.models.length < initialLen;
  }

  public getYears(modelId?: string): VehicleYear[] {
    if (modelId) {
      return this.data.years.filter(y => y.modelId === modelId);
    }
    return this.data.years;
  }

  public addYear(year: VehicleYear): VehicleYear {
    this.data.years.push(year);
    this.save();
    return year;
  }

  public getVariants(modelId?: string): VehicleVariant[] {
    if (modelId) {
      return this.data.variants.filter(v => v.modelId === modelId);
    }
    return this.data.variants;
  }

  public addVariant(variant: VehicleVariant): VehicleVariant {
    this.data.variants.push(variant);
    this.save();
    return variant;
  }

  // --- Materials ---
  public getMaterials(): MaterialOption[] {
    return this.data.materials;
  }

  public addMaterial(material: MaterialOption): MaterialOption {
    this.data.materials.push(material);
    this.save();
    return material;
  }

  public updateMaterial(id: string, updates: Partial<MaterialOption>): MaterialOption | null {
    const idx = this.data.materials.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.materials[idx] = { ...this.data.materials[idx], ...updates };
    this.save();
    return this.data.materials[idx];
  }

  // --- Products ---
  public getProducts(publishedOnly: boolean = false): Product[] {
    if (publishedOnly) {
      return this.data.products.filter(p => p.isPublished);
    }
    return this.data.products;
  }

  public findProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public findProductBySlug(slug: string): Product | undefined {
    return this.data.products.find(p => p.slug === slug);
  }

  public createProduct(product: Product): Product {
    this.data.products.push(product);
    this.save();
    return product;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.save();
    return this.data.products.length < initialLen;
  }

  // --- Orders ---
  public getOrders(userId?: string): Order[] {
    if (userId) {
      return this.data.orders.filter(o => o.userId === userId);
    }
    return this.data.orders;
  }

  public findOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.orderNumber === id);
  }

  public createOrder(order: Order): Order {
    this.data.orders.unshift(order);
    this.save();
    return order;
  }

  public updateOrder(id: string, updates: Partial<Order>): Order | null {
    const idx = this.data.orders.findIndex(o => o.id === id || o.orderNumber === id);
    if (idx === -1) return null;
    this.data.orders[idx] = {
      ...this.data.orders[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.orders[idx];
  }

  // --- Reviews ---
  public getReviews(onlyApproved: boolean = false): Review[] {
    if (onlyApproved) {
      return this.data.reviews.filter(r => r.status === 'approved');
    }
    return this.data.reviews;
  }

  public createReview(review: Review): Review {
    this.data.reviews.unshift(review);
    this.save();
    return review;
  }

  public updateReview(id: string, updates: Partial<Review>): Review | null {
    const idx = this.data.reviews.findIndex(r => r.id === id);
    if (idx === -1) return null;
    this.data.reviews[idx] = { ...this.data.reviews[idx], ...updates };
    this.save();
    return this.data.reviews[idx];
  }

  public deleteReview(id: string): boolean {
    const initialLen = this.data.reviews.length;
    this.data.reviews = this.data.reviews.filter(r => r.id !== id);
    this.save();
    return this.data.reviews.length < initialLen;
  }

  // --- Blog ---
  public getBlogPosts(onlyPublished: boolean = false): BlogPost[] {
    if (onlyPublished) {
      return this.data.blogPosts.filter(b => b.isPublished);
    }
    return this.data.blogPosts;
  }

  public findBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.data.blogPosts.find(b => b.slug === slug || b.id === slug);
  }

  public createBlogPost(post: BlogPost): BlogPost {
    this.data.blogPosts.unshift(post);
    this.save();
    return post;
  }

  public updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | null {
    const idx = this.data.blogPosts.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.blogPosts[idx] = { ...this.data.blogPosts[idx], ...updates };
    this.save();
    return this.data.blogPosts[idx];
  }

  public deleteBlogPost(id: string): boolean {
    const initialLen = this.data.blogPosts.length;
    this.data.blogPosts = this.data.blogPosts.filter(b => b.id !== id);
    this.save();
    return this.data.blogPosts.length < initialLen;
  }

  // --- Coupons ---
  public getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  public findCouponByCode(code: string): Coupon | undefined {
    return this.data.coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
  }

  public createCoupon(coupon: Coupon): Coupon {
    this.data.coupons.push(coupon);
    this.save();
    return coupon;
  }

  public updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const idx = this.data.coupons.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.coupons[idx] = { ...this.data.coupons[idx], ...updates };
    this.save();
    return this.data.coupons[idx];
  }

  public deleteCoupon(id: string): boolean {
    const initialLen = this.data.coupons.length;
    this.data.coupons = this.data.coupons.filter(c => c.id !== id);
    this.save();
    return this.data.coupons.length < initialLen;
  }

  // --- Contact Messages ---
  public getContactMessages(): ContactMessage[] {
    return this.data.contactMessages;
  }

  public createContactMessage(msg: ContactMessage): ContactMessage {
    this.data.contactMessages.unshift(msg);
    this.save();
    return msg;
  }

  public updateContactMessage(id: string, updates: Partial<ContactMessage>): ContactMessage | null {
    const idx = this.data.contactMessages.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.contactMessages[idx] = { ...this.data.contactMessages[idx], ...updates };
    this.save();
    return this.data.contactMessages[idx];
  }

  public deleteContactMessage(id: string): boolean {
    const initialLen = this.data.contactMessages.length;
    this.data.contactMessages = this.data.contactMessages.filter(m => m.id !== id);
    this.save();
    return this.data.contactMessages.length < initialLen;
  }

  // --- Newsletter ---
  public getNewsletterSubscribers(): NewsletterSubscriber[] {
    return this.data.newsletterSubscribers;
  }

  public addNewsletterSubscriber(email: string): boolean {
    const exists = this.data.newsletterSubscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
    if (exists) return false;
    this.data.newsletterSubscribers.unshift({
      id: 'sub_' + Date.now(),
      email: email.toLowerCase().trim(),
      status: 'active',
      subscribedAt: new Date().toISOString()
    });
    this.save();
    return true;
  }

  // --- CMS Pages ---
  public getPages(): CmsPage[] {
    return this.data.pages;
  }

  public findPageBySlug(slug: string): CmsPage | undefined {
    return this.data.pages.find(p => p.slug === slug);
  }

  public createPage(page: CmsPage): CmsPage {
    this.data.pages.push(page);
    this.save();
    return page;
  }

  public updatePage(id: string, updates: Partial<CmsPage>): CmsPage | null {
    const idx = this.data.pages.findIndex(p => p.id === id || p.slug === id);
    if (idx === -1) return null;
    this.data.pages[idx] = {
      ...this.data.pages[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.pages[idx];
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  public addAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): AuditLog {
    const entry: AuditLog = {
      ...log,
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString()
    };
    this.data.auditLogs.unshift(entry);
    // Keep max 500 audit logs
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.save();
    return entry;
  }

  // --- Settings ---
  public getSettings(): StoreSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }
}

export const db = new Database();

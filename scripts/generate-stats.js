#!/usr/bin/env node
/**
 * 📊 Ulk Statistics Generator
 * Generates comprehensive statistics about the humor repository
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ULK_ROOT = path.dirname(__dirname);
const OUTPUT_FILE = path.join(ULK_ROOT, 'STATISTICS.md');
const CONTENT_DIRS = ['witze', 'lieder', 'daily-wtf', 'bugs', 'deployment', 'team', 'meetings', 'code-reviews'];

// Simple statistics generator
class StatisticsGenerator {
    constructor() {
        this.stats = {
            categories: {},
            total: { files: 0, words: 0, characters: 0 },
            created: new Date().toISOString()
        };
    }
    
    generate() {
        console.log('📊 Generating Ulk Statistics...');
        
        CONTENT_DIRS.forEach(category => {
            const categoryPath = path.join(ULK_ROOT, category);
            if (fs.existsSync(categoryPath)) {
                const files = this.findMarkdownFiles(categoryPath);
                this.stats.categories[category] = files.length;
                this.stats.total.files += files.length;
            }
        });
        
        this.generateReport();
        console.log(`✅ Statistics generated: ${OUTPUT_FILE}`);
    }
    
    findMarkdownFiles(dir) {
        const files = [];
        if (!fs.existsSync(dir)) return files;
        
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const itemPath = path.join(dir, item);
            if (fs.statSync(itemPath).isFile() && item.endsWith('.md')) {
                files.push(itemPath);
            }
        }
        return files;
    }
    
    generateReport() {
        const report = `# 📊 Ulk Repository Statistics

Generated: ${new Date().toLocaleDateString()}

## 📊 Content Overview

| Category | Files |
|----------|-------|
${Object.entries(this.stats.categories).map(([cat, count]) => `| ${cat} | ${count} |`).join('\n')}
| **Total** | **${this.stats.total.files}** |

## 🎯 Summary

- 📝 Total content files: ${this.stats.total.files}
- 🎭 Categories: ${Object.keys(this.stats.categories).length}
- 📅 Last updated: ${new Date().toLocaleDateString()}

---

*Generated automatically by Ulk Statistics Generator* 🤖
`;
        
        fs.writeFileSync(OUTPUT_FILE, report, 'utf8');
    }
}

// Run if called directly
if (require.main === module) {
    const generator = new StatisticsGenerator();
    generator.generate();
}

module.exports = StatisticsGenerator;